export type ChatResponse = { reply: string; session_id?: string };

const BASE = (() => {
  if (typeof window === "undefined") return "/api";
  const w = window as any;
  if (w.VAANI_API_BASE) return w.VAANI_API_BASE as string;
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "http://127.0.0.1:8000/api" : "/api";
})();

async function safeFetch(input: string, init?: RequestInit, timeoutMs = 20000) {
  let timedOut = false;
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      timedOut = true;
      reject(new Error("timeout"));
    }, timeoutMs);
  });
  const res = (await Promise.race([
    fetch(`${BASE}${input}`, { ...init }),
    timeout,
  ])) as Response;
  if (timedOut) throw new Error("timeout");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function chatDirectGemini(
  message: string,
  apiKey: string,
): Promise<ChatResponse> {
  const model = "gemini-1.5-flash-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const prompt = `You are Vaani, a helpful voice assistant. Provide concise, helpful answers.\n\nUser: ${message}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3 },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const reply =
    (data?.candidates?.[0]?.content?.parts || [])
      .map((p: any) => p?.text)
      .join("\n") || "";
  return { reply };
}

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

async function chatDirectGeminiWithMessages(
  messages: ChatMessage[],
  apiKey: string,
): Promise<ChatResponse> {
  const model = "gemini-1.5-flash-latest";
  const contents: any[] = [
    {
      role: "user",
      parts: [
        {
          text: "You are Vaani, a helpful voice assistant. Be concise and maintain context.",
        },
      ],
    },
  ];
  for (const m of messages.slice(-12)) {
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = { contents, generationConfig: { temperature: 0.3 } };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const reply =
    (data?.candidates?.[0]?.content?.parts || [])
      .map((p: any) => p?.text)
      .join("\n") || "";
  return { reply };
}

export const api = {
  async chat(message: string): Promise<ChatResponse> {
    const provider = (
      localStorage.getItem("vaani.ai.provider") || "gemini"
    ).toLowerCase();
    const apiKey = localStorage.getItem("vaani.ai.apiKey") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-provider": provider,
      "Accept-Language": localStorage.getItem('vaani.settings.lang') || 'en-US',
    };
    if (apiKey) headers["x-api-key"] = apiKey;
    try {
      return await safeFetch("/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ message }),
      });
    } catch {
      if (provider === "gemini" && apiKey) {
        try {
          return await chatDirectGemini(message, apiKey);
        } catch {}
      }
      // If provider requires an API key and none configured, return clear instruction
      if ((provider === 'gemini' || provider === 'openrouter') && !apiKey) {
        return { reply: "Online service unavailable: AI provider not configured. Open Settings and configure AI provider + API key." };
      }
      return {
        reply:
          "I'm offline right now. Here's a quick local response while I reconnect.",
      };
    }
  },
  async chatWithContext(messages: ChatMessage[]): Promise<ChatResponse> {
    const provider = (
      localStorage.getItem("vaani.ai.provider") || "gemini"
    ).toLowerCase();
    const apiKey = localStorage.getItem("vaani.ai.apiKey") || "";
    if (provider === "gemini" && apiKey) {
      try {
        return await chatDirectGeminiWithMessages(messages, apiKey);
      } catch {}
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-provider": provider,
      "Accept-Language": localStorage.getItem('vaani.settings.lang') || 'en-US',
    };
    if (apiKey) headers["x-api-key"] = apiKey;
    try {
      return await safeFetch("/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ messages }),
      });
    } catch {
      // If provider requires API key and is not configured, return clear instruction
      if ((provider === 'gemini' || provider === 'openrouter') && !apiKey) {
        return { reply: "Online service unavailable: AI provider not configured. Open Settings and configure AI provider + API key." };
      }
      return { reply: "I'm offline right now. Continuing locally." };
    }
  },
  async parseIntent(
    text: string,
  ): Promise<{
    intent: string;
    confidence: number;
    entities: Record<string, any>;
  }> {
    try {
      return await safeFetch("/intent/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch {
      return { intent: "unknown", confidence: 0.0, entities: {} };
    }
  },
};
