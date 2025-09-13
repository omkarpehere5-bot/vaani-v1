import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/apiClient";
import { cn } from "@/lib/utils";
import {
  Mic,
  Square,
  Volume2,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy as CopyIcon,
  Pencil,
} from "lucide-react";

interface ConversationItem {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isFavorite?: boolean;
  reactions?: { thumbsUp?: boolean; thumbsDown?: boolean };
}

const uid = () =>
  typeof crypto !== "undefined" && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function Chat() {
  const [params] = useSearchParams();
  const initial = (params.get("q") || "").trim();
  const [query, setQuery] = useState(initial);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(() => {
    const existing = localStorage.getItem("vaani.sessionId");
    if (existing) return existing;
    const id = (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : String(Date.now());
    localStorage.setItem("vaani.sessionId", id);
    return id;
  }) as React.MutableRefObject<string>;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatStarred, setChatStarred] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("vaani.chats");
      if (!raw) return false;
      const arr = JSON.parse(raw) as any[];
      const found = arr.find(
        (c: any) => c.id === localStorage.getItem("vaani.sessionId"),
      );
      return !!found?.isStarred;
    } catch {
      return false;
    }
  });
  const stopRecognitionRef = useRef<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadForSession = (sessionId: string | null) => {
      if (!sessionId) {
        setConversations([]);
        return;
      }
      const raw = localStorage.getItem(`vaani.conversations.${sessionId}`);
      if (raw) {
        try {
          const arr = JSON.parse(raw) as any[];
          setConversations(arr.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
          return;
        } catch {}
      }
      setConversations([]);
    };

    // Initial load
    loadForSession(sessionIdRef.current);

    if (initial) {
      handleSend(initial);
    }

    // React to session change (e.g., New Chat)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "vaani.sessionId") {
        const newId = e.newValue as string | null;
        if (newId && newId !== sessionIdRef.current) {
          sessionIdRef.current = newId as any;
          loadForSession(newId);
        } else if (!newId) {
          sessionIdRef.current = (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now());
          loadForSession(sessionIdRef.current);
        }
      }
    };
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const serializable = conversations.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    }));
    localStorage.setItem(
      `vaani.conversations.${sessionIdRef.current}`,
      JSON.stringify(serializable),
    );
    // Update global history (truncate to last 200 msgs)
    try {
      const raw = localStorage.getItem("vaani.history.global");
      const existing = raw ? (JSON.parse(raw) as any[]) : [];
      const merged = [...existing, ...serializable.slice(-1)];
      const trimmed = merged.slice(-200);
      localStorage.setItem("vaani.history.global", JSON.stringify(trimmed));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "vaani.history.global",
          newValue: JSON.stringify(trimmed),
        }),
      );
    } catch {}
    // Update chats metadata
    try {
      const raw = localStorage.getItem("vaani.chats");
      const arr = raw ? (JSON.parse(raw) as any[]) : [];
      const firstUser = conversations.find((m) => m.type === "user");
      const last = conversations[conversations.length - 1];
      const idx = arr.findIndex((c) => c.id === sessionIdRef.current);
      const item = {
        id: sessionIdRef.current,
        title: (firstUser?.content || "New Chat").slice(0, 60),
        lastMessage: last?.content || "",
        timestamp: last?.timestamp?.toISOString() || new Date().toISOString(),
        isPinned: false,
        isStarred: chatStarred,
        messageCount: conversations.length,
      };
      if (idx >= 0) arr[idx] = item;
      else arr.unshift(item);
      localStorage.setItem("vaani.chats", JSON.stringify(arr));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "vaani.chats",
          newValue: JSON.stringify(arr),
        }),
      );
    } catch {}
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [conversations, chatStarred]);

  const cancelSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      utterance.volume = 0.85;
      const voices = speechSynthesis.getVoices();
      const femalePreferred = (v: SpeechSynthesisVoice) => {
        const n = (v.name || "").toLowerCase();
        return /female|samantha|zira|sonia|aria|jenny|natasha|linda|susan|eva|sara|neural|woman/.test(n);
      };
      const byLang = voices.filter((v) => v.lang === (localStorage.getItem("vaani.settings.lang") || "en-US"));
      const pick = byLang.find(femalePreferred) || voices.find(femalePreferred) || byLang[0] || voices[0];
      if (pick) utterance.voice = pick;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    if (!isSpeaking) {
      if (stopRecognitionRef.current) {
        try {
          stopRecognitionRef.current.stop();
        } catch {}
        stopRecognitionRef.current = null;
      }
      return;
    }
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window))
      return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (event: any) => {
      const transcript: string = Array.from(event.results)
        .map((r: any) => r[0]?.transcript || "")
        .join("")
        .toLowerCase();
      if (transcript.includes("stop")) {
        cancelSpeaking();
        try {
          rec.stop();
        } catch {}
        return;
      }
      if (
        transcript.includes("copy the response") ||
        transcript.includes("copy response") ||
        transcript.includes("copy it")
      ) {
        const lastAssistant = [...conversations]
          .reverse()
          .find((m) => m.type === "assistant");
        if (lastAssistant) {
          navigator.clipboard.writeText(lastAssistant.content);
        }
        try {
          rec.stop();
        } catch {}
        return;
      }
    };
    rec.onerror = () => {
      try {
        rec.stop();
      } catch {}
    };
    rec.onend = () => {};
    stopRecognitionRef.current = rec;
    try {
      rec.start();
    } catch {}
    return () => {
      try {
        rec.stop();
      } catch {}
    };
  }, [isSpeaking, cancelSpeaking]);

  const handleSend = async (text?: string) => {
    const content = (text ?? query).trim();
    if (!content) return;
    const user: ConversationItem = {
      id: uid(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setConversations((prev) => [...prev, user]);
    setQuery("");
    setIsProcessing(true);
    try {
      // Local file/app intent (browser-safe)
      const intentOpen = /(open|launch)\s+(?:my\s+)?(.+)/i.exec(content);
      if (intentOpen) {
        if ("showOpenFilePicker" in window) {
          const [handle]: any = await (window as any).showOpenFilePicker({
            multiple: false,
          });
          const file = await handle.getFile();
          const url = URL.createObjectURL(file);
          window.open(url, "_blank");
          const replyMsg = `Opened ${file.name} in a new tab.`;
          const assistant: ConversationItem = {
            id: uid(),
            type: "assistant",
            content: replyMsg,
            timestamp: new Date(),
          };
          setConversations((prev) => [...prev, assistant]);
          setIsProcessing(false);
          speakText(replyMsg);
          return;
        } else {
          const replyMsg =
            "To open local files/apps, please use the desktop app version. Browser access is limited for your security.";
          const assistant: ConversationItem = {
            id: uid(),
            type: "assistant",
            content: replyMsg,
            timestamp: new Date(),
          };
          setConversations((prev) => [...prev, assistant]);
          setIsProcessing(false);
          speakText(replyMsg);
          return;
        }
      }

      // Fast local date/time responses
      const lower = content.toLowerCase();
      if (
        [
          "what's the time",
          "what is the time",
          "current time",
          "time now",
          "tell me the time",
          "kya time",
          "samay",
          "waqt",
        ].some((k) => lower.includes(k))
      ) {
        const msg = `The current time is ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        const assistant: ConversationItem = {
          id: uid(),
          type: "assistant",
          content: msg,
          timestamp: new Date(),
        };
        setConversations((prev) => [...prev, assistant]);
        setIsProcessing(false);
        speakText(msg);
        return;
      }
      if (
        [
          "what's the date",
          "what is the date",
          "today's date",
          "current date",
          "date today",
          "date now",
          "what day is it",
          "which day is it",
        ].some((k) => lower.includes(k))
      ) {
        const d = new Date();
        const msg = `Today is ${d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;
        const assistant: ConversationItem = {
          id: uid(),
          type: "assistant",
          content: msg,
          timestamp: new Date(),
        };
        setConversations((prev) => [...prev, assistant]);
        setIsProcessing(false);
        speakText(msg);
        return;
      }

      const context = conversations.map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.content,
      }));
      const res = await ((api as any).chatWithContext
        ? (api as any).chatWithContext([...context, { role: "user", content }])
        : api.chat(content));
      const reply = res.reply || "";
      const assistant: ConversationItem = {
        id: uid(),
        type: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setConversations((prev) => [...prev, assistant]);
      setIsProcessing(false);
      speakText(reply);
    } catch (e) {
      const fallback = "Online service unavailable. Using local response.";
      const assistant: ConversationItem = {
        id: uid(),
        type: "assistant",
        content: fallback,
        timestamp: new Date(),
      };
      setConversations((prev) => [...prev, assistant]);
      setIsProcessing(false);
      speakText(fallback);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    const serializable = conversations.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    }));
    localStorage.setItem(
      `vaani.conversations.${sessionIdRef.current}`,
      JSON.stringify(serializable),
    );
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [conversations]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 blue-gradient-bg">
      <div className="w-full max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
          <Button
            variant={chatStarred ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const next = !chatStarred;
              setChatStarred(next);
              try {
                const raw = localStorage.getItem("vaani.chats");
                const arr = raw ? (JSON.parse(raw) as any[]) : [];
                const idx = arr.findIndex(
                  (c: any) => c.id === sessionIdRef.current,
                );
                if (idx >= 0) {
                  arr[idx].isStarred = next;
                  localStorage.setItem("vaani.chats", JSON.stringify(arr));
                  window.dispatchEvent(
                    new StorageEvent("storage", {
                      key: "vaani.chats",
                      newValue: JSON.stringify(arr),
                    }),
                  );
                }
              } catch {}
            }}
            aria-label={chatStarred ? "Unfavorite chat" : "Favorite chat"}
          >
            {chatStarred ? "★ Favorited" : "☆ Favorite"}
          </Button>
        </div>
        <Card className="border-2 border-border/50 glass-morphism">
          <CardContent
            ref={listRef}
            className="p-4 max-h-[65vh] overflow-y-auto space-y-3"
          >
            {conversations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Ask something to start the conversation.
              </p>
            )}
            {conversations.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.type === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[75%] whitespace-pre-wrap",
                    m.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  {m.content}
                </div>
                <div
                  className={cn(
                    "mt-2 flex items-center gap-3 px-1",
                    m.type === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {m.type === "assistant" ? (
                    <>
                      <button
                        title="Like"
                        aria-label="Like"
                        onClick={() => {
                          setConversations((prev) =>
                            prev.map((x) =>
                              x.id === m.id
                                ? {
                                    ...x,
                                    reactions: {
                                      thumbsUp: !x.reactions?.thumbsUp,
                                      thumbsDown: false,
                                    },
                                  }
                                : x,
                            ),
                          );
                        }}
                        className="opacity-80 hover:opacity-100"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        title="Dislike"
                        aria-label="Dislike"
                        onClick={() => {
                          setConversations((prev) =>
                            prev.map((x) =>
                              x.id === m.id
                                ? {
                                    ...x,
                                    reactions: {
                                      thumbsDown: !x.reactions?.thumbsDown,
                                      thumbsUp: false,
                                    },
                                  }
                                : x,
                            ),
                          );
                        }}
                        className="opacity-80 hover:opacity-100"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button
                        title="Copy response"
                        aria-label="Copy response"
                        onClick={() => navigator.clipboard.writeText(m.content)}
                        className="opacity-80 hover:opacity-100"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        title="Edit query"
                        aria-label="Edit query"
                        onClick={() => {
                          setQuery(m.content);
                          inputRef.current?.focus();
                        }}
                        className="opacity-80 hover:opacity-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Copy query"
                        aria-label="Copy query"
                        onClick={() => navigator.clipboard.writeText(m.content)}
                        className="opacity-80 hover:opacity-100"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={() => handleSend()}
            disabled={isProcessing}
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </Button>
          {isSpeaking && (
            <Button
              onClick={cancelSpeaking}
              variant="secondary"
              aria-label="Stop speaking"
            >
              <Square className="w-4 h-4 mr-1" /> Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
