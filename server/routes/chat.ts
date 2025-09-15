import type { RequestHandler } from "express";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

async function callOpenRouterWithMessages(messages: ChatMessage[], apiKey: string, session_id?: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": "Vaani",
  };
  const SYSTEM: ChatMessage = { role: 'system', content: 'You are Vaani, a helpful voice assistant. Be concise. Maintain conversational context and resolve references based on prior turns. Ask for clarification when needed.' };
  const trimmed = messages.filter(m => m.content && m.content.trim()).slice(-12);
  const body = {
    model: OPENROUTER_MODEL,
    messages: [SYSTEM, ...trimmed],
    temperature: 0.3,
  };
  const resp = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`OpenRouter error ${resp.status}: ${text.slice(0, 400)}`);
  }
  const data = (await resp.json()) as any;
  const reply: string = data?.choices?.[0]?.message?.content ?? "";
  return { reply, session_id };
}

function toGeminiContents(messages: ChatMessage[]) {
  const systemText = 'You are Vaani, a helpful voice assistant. Be concise. Maintain conversational context and resolve references based on prior turns. Ask for clarification when needed.';
  const contents: any[] = [{ role: 'user', parts: [{ text: systemText }] }];
  for (const m of messages.slice(-12)) {
    if (!m.content?.trim()) continue;
    const role = m.role === 'assistant' ? 'model' : 'user';
    contents.push({ role, parts: [{ text: m.content }] });
  }
  return contents;
}

async function callGeminiWithMessages(messages: ChatMessage[], apiKey: string, session_id?: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;
  const body = {
    contents: toGeminiContents(messages),
    generationConfig: { temperature: 0.3 },
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Gemini error ${resp.status}: ${text.slice(0, 400)}`);
  }
  const data = (await resp.json()) as any;
  const reply: string =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join("\n") ??
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "";
  return { reply, session_id };
}

function normalize(str: string) { return (str || '').toLowerCase().trim(); }

function extractWeatherIntent(messages: ChatMessage[]) {
  const last = messages[messages.length - 1];
  const prev = messages[messages.length - 2];
  const text = normalize(last?.content || '');
  const hasWeatherKeyword = /(weather|temperature|forecast)/i.test(last?.content || '');
  const assistantAskedLocation = prev && prev.role === 'assistant' && /(location|which city|which place)/i.test(prev.content || '');
  let intent = hasWeatherKeyword || assistantAskedLocation;

  let location: string | null = null;
  const locMatch = /\b(?:in|at|for)\s+([a-zA-Z\s,'.-]{2,})/.exec(last?.content || '') || /([a-zA-Z\s,'.-]{2,})\s+weather/.exec(last?.content || '');
  if (locMatch && locMatch[1]) {
    location = locMatch[1].replace(/\.$/, '').trim();
  }
  if (!location && assistantAskedLocation && last?.role === 'user') {
    location = last.content.trim();
  }
  if (!location) {
    // search earlier messages for a location with weather
    for (let i = messages.length - 2; i >= 0; i--) {
      const m = messages[i];
      const mtext = m.content || '';
      const mHasWeather = /(weather|temperature|forecast)/i.test(mtext);
      const mLoc = /\b(?:in|at|for)\s+([a-zA-Z\s,'.-]{2,})/.exec(mtext) || /([a-zA-Z\s,'.-]{2,})\s+weather/.exec(mtext);
      if (mHasWeather && mLoc && mLoc[1]) { location = mLoc[1].trim(); break; }
    }
  }
  return { intent, location };
}

async function getWeatherForLocation(location: string) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  const g = await fetch(geoUrl);
  if (!g.ok) throw new Error(`geocoding ${g.status}`);
  const gj = await g.json();
  const rec = gj?.results?.[0];
  if (!rec) return null;
  const lat = rec.latitude, lon = rec.longitude, name = rec.name, country = rec.country, admin1 = rec.admin1;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&timezone=auto`;
  const w = await fetch(weatherUrl);
  if (!w.ok) throw new Error(`weather ${w.status}`);
  const jw = await w.json();
  const cur = jw.current || jw.current_weather || {};
  const temp = cur.temperature_2m ?? cur.temperature ?? null;
  const wind = cur.wind_speed_10m ?? cur.windspeed ?? null;
  const precip = cur.precipitation ?? 0;
  const place = [name, admin1, country].filter(Boolean).join(', ');
  return { place, temp, wind, precip };
}

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message, messages, session_id } = (req.body || {}) as {
      message?: string;
      messages?: ChatMessage[];
      session_id?: string;
    };
    const finalMessages: ChatMessage[] | null = Array.isArray(messages) && messages.length
      ? messages
      : (message && message.trim() ? [{ role: 'user', content: message }] : null);
    if (!finalMessages) {
      return res.status(400).json({ error: "message or messages required" });
    }

    // FAQ: who made you
    const lastText = (finalMessages[finalMessages.length - 1]?.content || '').toLowerCase();
    if (/who\s+made\s+you|who\s+created\s+you|developers?/.test(lastText)) {
      const reply = "I was created as a Final Year B.E. IT Project by Omkar Vijay Pehere, Harshal Sanjay Pagar, Prerana Bhalerao, and Shraddha Gade from JIT College, Nashik. My purpose is to assist the visually impaired, physically handicapped, and normal users in interacting with their PCs through voice.";
      return res.json({ reply, session_id });
    }
    // FAQ: what can you do
    if (/what\s+can\s+you\s+do|your\s+features|help\s+me/.test(lastText)) {
      const reply = "I can: listen with wake word, understand and speak (multi‑language), remember context, chat using online AI, handle reminders/notes, read images (OCR), control system volume/brightness and open apps, fetch current weather, and provide accessible UI with high contrast and large controls.";
      return res.json({ reply, session_id });
    }

    // Weather intent short-circuit (fast, no key)
    const weatherCheck = extractWeatherIntent(finalMessages);
    if (weatherCheck.intent) {
      if (!weatherCheck.location) {
        return res.json({ reply: "Please mention the exact location for the weather (e.g., weather in New Delhi).", session_id });
      }
      const data = await getWeatherForLocation(weatherCheck.location);
      if (!data) {
        return res.json({ reply: `I couldn't find that location. Please try a nearby city.`, session_id });
      }
      const { place, temp, wind, precip } = data;
      const reply = `Current weather in ${place}: ${temp !== null ? `${temp}°C` : 'N/A'}, wind ${wind !== null ? `${wind} km/h` : 'N/A'}, precipitation ${precip ?? 0} mm.`;
      return res.json({ reply, session_id });
    }

    // Date intent short-circuit
    const acceptLang = String(req.header('accept-language') || 'en-US');
    const today = new Date();
    const computeDateReply = (d: Date) => {
      try {
        const fmtDate = new Intl.DateTimeFormat(acceptLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(d);
        const langPrefix = (acceptLang || 'en').toLowerCase();
        if (langPrefix.startsWith('hi')) return `यह तारीख है ${fmtDate}`; // Hindi
        if (langPrefix.startsWith('mr')) return `ही तारीख आहे ${fmtDate}`; // Marathi
        return `The date is ${fmtDate}`;
      } catch (e) {
        const langPrefix = (acceptLang || 'en').toLowerCase();
        if (langPrefix.startsWith('hi')) return `यह तारीख है ${d.toDateString()}`;
        if (langPrefix.startsWith('mr')) return `ही तारीख आहे ${d.toDateString()}`;
        return `The date is ${d.toDateString()}`;
      }
    };
    if (/\b(?:what(?:'s| is)? the date|date of today|what date)\b/i.test(lastText) || /\btomorrow\b/i.test(lastText) || /\byesterday\b/i.test(lastText) || /day after tomorrow/i.test(lastText) || /in (\d+) days/i.test(lastText)) {
      let target = new Date(today);
      if (/\btomorrow\b/i.test(lastText)) target.setDate(today.getDate() + 1);
      else if (/\byesterday\b/i.test(lastText)) target.setDate(today.getDate() - 1);
      else if (/day after tomorrow/i.test(lastText)) target.setDate(today.getDate() + 2);
      else {
        const m = /in (\d+) days/i.exec(lastText);
        if (m) target.setDate(today.getDate() + parseInt(m[1], 10));
      }
      const reply = computeDateReply(target);
      return res.json({ reply, session_id });
    }

    const providerHeader = String(req.header("x-provider") || "").toLowerCase();
    const provider = providerHeader || (process.env.DEFAULT_PROVIDER || "gemini");

    const headerKey = req.header("x-api-key") || "";
    const envKeys: Record<string, string | undefined> = {
      gemini: process.env.GEMINI_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      bing: process.env.BING_API_KEY,
    };
    const apiKey = headerKey || envKeys[provider] || "";

    if (!apiKey && (provider === "gemini" || provider === "openrouter")) {
      return res.status(503).json({ error: `${provider.toUpperCase()}_API_KEY not configured` });
    }

    let result: { reply: string; session_id?: string };
    switch (provider) {
      case "gemini":
        result = await callGeminiWithMessages(finalMessages, apiKey, session_id);
        break;
      case "openrouter":
        result = await callOpenRouterWithMessages(finalMessages, apiKey, session_id);
        break;
      case "openai":
      case "bing":
        return res.status(501).json({ error: `${provider} provider not implemented yet` });
      default:
        return res.status(400).json({ error: `Unknown provider: ${provider}` });
    }

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: "internal_error", detail: String(err?.message || err) });
  }
};
