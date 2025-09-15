import React, { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Send,
  Volume2,
  Clock,
  MessageCircle,
  Sparkles,
  MicOff,
  Square,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Heart,
  Brain,
  Globe,
  Keyboard,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ConversationHistory from "@/components/ConversationHistory";
import { api } from "@/utils/apiClient";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConversationItem {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isFavorite?: boolean;
  voiceData?: {
    duration: number;
    confidence: number;
  };
}

const uid = () =>
  typeof crypto !== "undefined" && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function Index() {
  const {
    user,
    isAuthenticated,
    currentGreeting,
    screenReader,
    voiceCommands,
    getPersonalizedGreeting,
  } = useUser();
  const { t } = useLanguage();

  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoSearchTimer, setAutoSearchTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(
    () => localStorage.getItem("vaani.settings.wakeWord") === "true",
  );
  const [currentResponse, setCurrentResponse] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any | null>(null);
  const stopRecognitionRef = useRef<any | null>(null);
  const wakeRecognitionRef = useRef<any | null>(null);
  const navigate = useNavigate();

  // Initialize speech recognition (if available) and provide on-demand creation
  const ensureRecognition = () => {
    if (recognitionRef.current) return;
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const lang = localStorage.getItem("vaani.settings.lang") || "en-US";
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;
    rec.onstart = () => setIsListening(true);

    rec.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setQuery(transcript);

      if (last && last.isFinal) {
        if (transcript.trim()) {
          handleProcessVoiceInput(transcript, last[0].confidence);
          stopListening();
        }
        return;
      }

      if (autoSearchTimer) clearTimeout(autoSearchTimer);
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          const conf = last ? last[0].confidence : 0.8;
          handleProcessVoiceInput(transcript, conf);
          stopListening();
        }
      }, 1000);
      setAutoSearchTimer(timer);
    };

    rec.onerror = () => {
      setIsListening(false);
      playErrorSound();
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
  };

  useEffect(() => {
    ensureRecognition();
  }, []);

  // Cleanup auto-search timer on unmount
  useEffect(() => {
    return () => {
      if (autoSearchTimer) {
        clearTimeout(autoSearchTimer);
      }
    };
  }, [autoSearchTimer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + V for voice input
      if (e.altKey && e.key === "v") {
        e.preventDefault();
        handleVoiceInput();
      }

      // Alt + S to stop listening
      if (e.altKey && e.key === "s") {
        e.preventDefault();
        stopListening();
      }

      // Alt + Enter to submit
      if (e.altKey && e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }

      // Alt + H to toggle history
      if (e.altKey && e.key === "h") {
        e.preventDefault();
        setShowHistory(!showHistory);
      }

      // Escape to focus input
      if (e.key === "Escape") {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHistory]);

  // Wake word detection using lightweight separate recognizer
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window))
      return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const startWake = () => {
      if (
        wakeRecognitionRef.current ||
        isListening ||
        isSpeaking ||
        !wakeWordEnabled
      )
        return;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = localStorage.getItem("vaani.settings.lang") || "en-US";
      rec.onresult = (event: any) => {
        const transcript: string = Array.from(event.results)
          .map((r: any) => r[0]?.transcript || "")
          .join("")
          .toLowerCase();
        const wakePhrases = [
          "hey vaani",
          "hello vaani",
          "ok vaani",
          "okay vaani",
          "oye vaani",
          "hi vaani",
          "he vaani",
          "o vaani",
          "hey wani",
        ];
        if (wakePhrases.some((p) => transcript.includes(p))) {
          try {
            rec.stop();
          } catch {}
          wakeRecognitionRef.current = null;
          playSuccessSound();
          setTimeout(() => handleVoiceInput(), 150);
        }
      };
      rec.onerror = () => {
        try {
          rec.stop();
        } catch {}
        wakeRecognitionRef.current = null;
      };
      rec.onend = () => {
        wakeRecognitionRef.current = null;
        if (wakeWordEnabled) setTimeout(startWake, 500);
      };
      wakeRecognitionRef.current = rec;
      try {
        rec.start();
      } catch {}
    };

    if (wakeWordEnabled && !isListening && !isSpeaking) startWake();
    return () => {
      if (wakeRecognitionRef.current) {
        try {
          wakeRecognitionRef.current.stop();
        } catch {}
        wakeRecognitionRef.current = null;
      }
    };
  }, [wakeWordEnabled, isListening, isSpeaking]);

  // Auto-start continuous listening and react to global wake event
  useEffect(() => {
    const continuous =
      localStorage.getItem("vaani.settings.continuous") === "true";
    const ww = localStorage.getItem("vaani.settings.wakeWord") === "true";
    setWakeWordEnabled(ww);
    if (continuous && !isListening) handleVoiceInput();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "vaani.settings.wakeWord")
        setWakeWordEnabled(e.newValue === "true");
    };
    const onWake = () => handleVoiceInput();
    window.addEventListener("storage", onStorage);
    window.addEventListener("vaani:wake", onWake as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vaani:wake", onWake as any);
    };
  }, []);

  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playErrorSound = () => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.4,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  };

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
      const lang = localStorage.getItem("vaani.settings.lang") || "en-US";
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      const voices = speechSynthesis.getVoices();
      const femalePreferred = (v: SpeechSynthesisVoice) => {
        const n = (v.name || "").toLowerCase();
        return /female|samantha|zira|sonia|aria|jenny|natasha|linda|susan|eva|sara|neural|woman/.test(n);
      };
      const rawLang = lang;
      const short = rawLang.split('-')[0];
      const byExact = voices.filter((v) => (v.lang || '').toLowerCase() === rawLang.toLowerCase());
      const byPrefix = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(short.toLowerCase()));
      const pick = byExact.find(femalePreferred) || byPrefix.find(femalePreferred) || byExact[0] || byPrefix[0] || voices.find(femalePreferred) || voices[0];
      if (pick) utterance.voice = pick;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Voice command "stop" while speaking
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
    rec.lang = localStorage.getItem("vaani.settings.lang") || "en-US";
    rec.onresult = (event: any) => {
      const transcript: string = Array.from(event.results)
        .map((r: any) => r[0]?.transcript || "")
        .join("")
        .toLowerCase();
      // support stop words in English, Hindi, Marathi
      const stopRegex = /\b(stop(?:\s+it)?|rukho|रुको|thamb|थांब|थांबो|थांब\b)\b/i;
      if (stopRegex.test(transcript)) {
        cancelSpeaking();
        try {
          rec.stop();
        } catch {}
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

  const handleSearch = async () => {
    if (!query.trim()) return;

    const userMessage: ConversationItem = {
      id: uid(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };

    setConversations((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    playSuccessSound();

    try {
      setIsNavigating(true);
      // Navigate to dedicated chat page
      navigate(`/chat?q=${encodeURIComponent(query)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessVoiceInput = (transcript: string, confidence: number) => {
    const userMessage: ConversationItem = {
      id: uid(),
      type: "user",
      content: transcript,
      timestamp: new Date(),
      voiceData: {
        duration: 3, // Mock duration
        confidence: Math.round(confidence * 100),
      },
    };

    setConversations((prev) => [...prev, userMessage]);
    setQuery(transcript);
    handleSearch();
  };

  const handleVoiceInput = () => {
    ensureRecognition();
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in your browser. Please use a modern browser like Chrome or Edge.",
      );
      return;
    }

    // ensure language is up-to-date
    try {
      recognitionRef.current.lang = localStorage.getItem('vaani.settings.lang') || 'en-US';
    } catch {}

    if (isListening) {
      stopListening();
    } else {
      // Try to start recognizer and handle possible errors robustly
      setQuery("");
      try {
        // Some browsers throw if recognition is already running; ensure state
        try { recognitionRef.current.start(); } catch (startErr) {
          console.warn('recognition start failed, attempting restart', startErr);
          try { recognitionRef.current.stop(); } catch (e) {}
          try { recognitionRef.current.start(); } catch (e) { console.error('start failed again', e); setIsListening(false); return; }
        }
        setIsListening(true);
        playSuccessSound();
      } catch (e) {
        console.error('Failed to start recognition', e);
        setIsListening(false);
        playErrorSound();
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Clear auto-search timer
    if (autoSearchTimer) {
      clearTimeout(autoSearchTimer);
      setAutoSearchTimer(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearHistory = () => {
    setConversations([]);
  };

  const toggleFavorite = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, isFavorite: !conv.isFavorite } : conv,
      ),
    );
  };

  const replayMessage = (content: string) => {
    setQuery(content);
    inputRef.current?.focus();
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuery(`Attached file: ${file.name}`);
      // Here you would typically upload the file and process it
      console.log("File selected:", file);
    }
  };

  const recentQueries = [
    "What's the weather like today?",
    "Set a reminder for my meeting",
    "Play some relaxing music",
    "What's trending in tech news?",
    "Help me plan my day",
    "Read my emails",
  ];

  const quickActions = [
    {
      icon: Volume2,
      label: "Play Music",
      color: "bg-blue-500/10 text-blue-500",
      action: () => setQuery("Play some music"),
    },
    {
      icon: Sparkles,
      label: "Get Ideas",
      color: "bg-purple-500/10 text-purple-500",
      action: () => setQuery("Give me some creative ideas"),
    },
    {
      icon: Globe,
      label: "News Update",
      color: "bg-red-500/10 text-red-500",
      action: () => setQuery("What's the latest news?"),
    },
    {
      icon: Brain,
      label: "AI Help",
      color: "bg-indigo-500/10 text-indigo-500",
      action: () => setQuery("Help me solve a problem"),
    },
  ];

  // Load global conversation history (from chat page)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vaani.history.global");
      if (raw) {
        const arr = JSON.parse(raw) as any[];
        setConversations(
          arr.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "vaani.ui.history.visible") {
        setShowHistory(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="min-h-screen flex p-6 gap-6 blue-gradient-bg relative">
      {(isProcessing || isNavigating) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex items-center space-x-3 p-4 rounded-lg glass-morphism">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Opening chat…</span>
          </div>
        </div>
      )}
      {/* Main Interface */}
      <div
        className={cn(
          "flex flex-col items-center justify-center transition-all duration-300",
          showHistory ? "w-2/3" : "w-full",
        )}
      >
        <div
          className={`w-full space-y-6 ${
            user?.useLargeText ? "max-w-2xl" : "max-w-xl"
          }`}
        >
          {/* Main Greeting */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2 floating-animation">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h1
              className={`font-bold tracking-tight text-foreground bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent ${
                user?.useLargeText ? "text-5xl" : "text-4xl"
              }`}
            >
              {isAuthenticated && user?.firstName
                ? `Hello, ${user.firstName}`
                : "Hello, Sir/Mam"}
            </h1>
            <p
              className={`text-muted-foreground ${
                user?.useLargeText ? "text-xl" : "text-lg"
              }`}
            >
              I'm Vaani — your personal voice assistant
            </p>
          </div>

          {/* Search Interface */}
          <Card className="border-2 border-border/50 shadow-2xl glass-morphism blue-gradient-card">
            <CardContent className="p-2">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t("type_question") || "Type your question, use voice, or try 'Hey Vaani'..."}
                    className={`pr-20 border border-border/50 bg-secondary/30 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:outline-none text-foreground placeholder:text-muted-foreground font-medium rounded-lg ${
                      user?.useLargeText ? "text-base h-8" : "text-sm h-7"
                    } ${
                      user?.useHighContrast
                        ? "border-2 border-primary bg-background"
                        : ""
                    }`}
                    disabled={isProcessing}
                    aria-label="Voice assistant input field"
                    autoComplete="off"
                  />
                  <div className="absolute right-1 top-1 flex items-center space-x-1">
                    <Button
                      onClick={handleFileAttach}
                      disabled={isProcessing}
                      variant="ghost"
                      className="h-6 w-6 p-0 rounded-full hover:bg-primary/10 transition-colors"
                      size="icon"
                      aria-label="Attach file"
                      title="Attach file"
                    >
                      <Paperclip className="w-3 h-3 text-muted-foreground hover:text-primary" />
                    </Button>
                    {query && (
                      <Button
                        onClick={handleSearch}
                        disabled={isProcessing}
                        className="h-6 w-6 p-0 rounded-full hover:bg-primary/90 transition-colors"
                        size="icon"
                        aria-label="Send message"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    aria-label="File input"
                  />
                </div>

                <Button
                  onClick={handleVoiceInput}
                  disabled={isProcessing}
                  size="lg"
                  className={cn(
                    "h-8 w-8 rounded-full transition-all duration-300 shadow-lg min-h-[32px] min-w-[32px]",
                    isListening
                      ? "bg-red-500 hover:bg-red-600 pulse-glow scale-110"
                      : "bg-primary hover:bg-primary/90 hover:scale-105",
                  )}
                  aria-label={
                    isListening ? "Stop voice input" : "Start voice input"
                  }
                  title={
                    isListening
                      ? "Click to stop listening (Alt+S)"
                      : "Click to start voice input (Alt+V)"
                  }
                >
                  {isListening ? (
                    <Square className="w-3 h-3 animate-pulse" />
                  ) : (
                    <Mic className="w-3 h-3" />
                  )}
                </Button>
              </div>

              {/* Status Indicators */}
              <div className="mt-1 space-y-1">
                {isListening && (
                  <div className="flex items-center justify-center space-x-3 animate-pulse">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-sm text-red-500 font-medium">
                      {query
                        ? "Stop speaking for 1s to search automatically..."
                        : "Listening... Speak now"}
                    </span>
                    <Button
                      onClick={stopListening}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 min-h-[32px] px-3 py-1 hover:bg-red-50 transition-colors"
                    >
                      <MicOff className="w-3 h-3 mr-1" />
                      Stop
                    </Button>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-primary font-medium">
                      Vaani is thinking...
                    </span>
                  </div>
                )}

                {isSpeaking && (
                  <div className="flex items-center justify-center space-x-3">
                    <Volume2 className="w-4 h-4 text-green-500 animate-pulse" />
                    <span className="text-base text-green-500 font-medium">
                      Vaani is speaking...
                    </span>
                    <Button
                      onClick={cancelSpeaking}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Square className="w-3 h-3 mr-1" /> Stop
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4 mt-12">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Quick Actions
                <Sparkles className="w-6 h-6 text-primary" />
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-4xl mx-auto">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full h-auto p-2 flex flex-col items-center justify-center space-y-1 hover:bg-secondary/80 transition-all duration-200 hover:scale-105 glass-morphism border-2 border-border/50 hover:border-primary/30 cursor-pointer ${
                    user?.useLargeText ? "min-h-[45px]" : "min-h-[40px]"
                  } ${
                    user?.useHighContrast
                      ? "border-primary bg-background hover:bg-primary/10"
                      : ""
                  } max-w-[200px]`}
                  onClick={() => {
                    action.action();
                    if (screenReader.isEnabled) {
                      screenReader.speak(`${action.label} selected`);
                    }
                  }}
                  aria-label={`Quick action: ${action.label}`}
                  onFocus={() => {
                    if (screenReader.isEnabled) {
                      screenReader.speak(action.label);
                    }
                  }}
                >
                  <div
                    className={cn(
                      `rounded-lg flex items-center justify-center transition-colors ${
                        user?.useLargeText ? "w-7 h-7" : "w-6 h-6"
                      }`,
                      action.color,
                    )}
                  >
                    <action.icon
                      className={user?.useLargeText ? "w-4 h-4" : "w-3 h-3"}
                    />
                  </div>
                  <span
                    className={`text-muted-foreground font-medium text-center ${
                      user?.useLargeText ? "text-base" : "text-sm"
                    }`}
                  >
                    {action.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* History Toggle Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => {
                const next = !showHistory;
                setShowHistory(next);
                try {
                  localStorage.setItem("vaani.ui.history.visible", next ? "true" : "false");
                  localStorage.setItem("vaani.ui.sidebar.visible", next ? "false" : "true");
                  window.dispatchEvent(new StorageEvent("storage", { key: "vaani.ui.history.visible", newValue: next ? "true" : "false" }));
                  window.dispatchEvent(new StorageEvent("storage", { key: "vaani.ui.sidebar.visible", newValue: next ? "false" : "true" }));
                } catch {}
              }}
              variant={showHistory ? "default" : "outline"}
              className={`glass-morphism h-12 px-6 text-base font-semibold transition-all duration-300 border-2 ${
                showHistory
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "border-primary/30 text-primary hover:border-primary/60 hover:bg-primary/5 hover:scale-105"
              } rounded-xl backdrop-blur-sm`}
              aria-label="Toggle conversation history"
            >
              <div className="flex items-center gap-2">
                <MessageCircle
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showHistory ? "rotate-12" : ""
                  }`}
                />
                <span>
                  {showHistory ? "Hide" : "Show"} Conversation History
                </span>
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    showHistory ? "bg-primary-foreground" : "bg-primary/60"
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Conversation History Sidebar */}
      {showHistory && (
        <div className="w-1/3 min-w-0">
          <ConversationHistory
            conversations={conversations}
            onClearHistory={clearHistory}
            onToggleFavorite={toggleFavorite}
            onReplayMessage={replayMessage}
            onSpeakMessage={speakText}
          />
        </div>
      )}
    </div>
  );
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
