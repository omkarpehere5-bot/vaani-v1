import { useState, useEffect, useCallback } from "react";
import { AccessibilityProvider } from "./AccessibilityModes";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import ConversationTimeline, { Message } from "./ConversationTimeline";
import CommandPalette from "./CommandPalette";
import LiveCaptions from "./LiveCaptions";
import AnimatedBackground from "./AnimatedBackground";
import SettingsDialog from "./SettingsDialog";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import {
  Bot,
  Calculator,
  Camera,
  Clock,
  FileText,
  Globe,
  Mic,
  Music,
  Settings,
  Languages,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isPinned: boolean;
  isStarred: boolean;
  messageCount: number;
  folder?: string;
}

interface ShortcutItem {
  id: string;
  name: string;
  command: string;
  icon: React.ReactNode;
  hotkey?: string;
}

interface SkillItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [micStatus, setMicStatus] = useState<
    "idle" | "listening" | "processing" | "speaking"
  >("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [privacyLevel, setPrivacyLevel] = useState<
    "local" | "cloud" | "ephemeral"
  >("local");
  const [micLocked, setMicLocked] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [captionsVisible, setCaptionsVisible] = useState(false);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm Vaani, your accessible AI assistant. I'm here to help everyone, including people with visual, hearing, motor, or cognitive differences. How can I assist you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      metadata: {
        model: "Vaani-v1",
        confidence: 0.95,
        processingTime: 1200,
      },
    },
    {
      id: "2",
      type: "user",
      content: "Can you help me understand how to use voice commands?",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: "3",
      type: "assistant",
      content:
        'Absolutely! Here are several ways to use voice commands with Vaani:\n\n1. **Push-to-Talk (PTT)**: Hold the Space bar and speak, release when done\n2. **Click the microphone**: Click the mic button to start/stop listening\n3. **Wake word**: Say "Hey Vaani" when wake word is enabled\n4. **Keyboard shortcuts**: Alt+V to toggle voice input, Alt+S to stop\n\nI\'m designed to work perfectly with screen readers, support multiple languages (English, Hindi, Marathi), and provide visual feedback for all interactions. Would you like me to demonstrate any specific feature?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      metadata: {
        model: "Vaani-v1",
        confidence: 0.98,
        processingTime: 1800,
      },
      sources: [
        {
          title: "Vaani Accessibility Guide",
          url: "https://vaani.ai/accessibility",
          snippet:
            "Comprehensive guide to using Vaani with assistive technologies",
        },
      ],
    },
  ]);

  // Chats from localStorage (kept in sync)
  const [chats, setChats] = useState<ChatItem[]>(() => {
    try {
      const raw = localStorage.getItem("vaani.chats");
      if (!raw) return [] as any;
      const arr = JSON.parse(raw) as any[];
      return arr.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) }));
    } catch {
      return [] as any;
    }
  });
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "vaani.chats") {
        try {
          const arr = JSON.parse(e.newValue || "[]");
          setChats(
            arr.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })),
          );
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const shortcuts: ShortcutItem[] = [
    {
      id: "quick-help",
      name: "Quick Help",
      command: "Show help for current context",
      icon: <Settings className="h-4 w-4" />,
      hotkey: "F1",
    },
    {
      id: "voice-toggle",
      name: "Toggle Voice",
      command: "Enable/disable voice input",
      icon: <Mic className="h-4 w-4" />,
      hotkey: "Alt+V",
    },
    {
      id: "translate",
      name: "Translate",
      command: "Translate selected text",
      icon: <Languages className="h-4 w-4" />,
      hotkey: "Ctrl+T",
    },
    {
      id: "timer",
      name: "Set Timer",
      command: "Start a countdown timer",
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  const skills: SkillItem[] = [
    {
      id: "web-search",
      name: "Web Search",
      description: "Search the internet for information",
      enabled: true,
      category: "Information",
    },
    {
      id: "calculator",
      name: "Calculator",
      description: "Perform mathematical calculations",
      enabled: true,
      category: "Tools",
    },
    {
      id: "music-control",
      name: "Music Control",
      description: "Control music playback",
      enabled: false,
      category: "Media",
    },
    {
      id: "file-manager",
      name: "File Manager",
      description: "Manage files and documents",
      enabled: true,
      category: "Productivity",
    },
  ];

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Global keyboard shortcuts following WCAG specification
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Talk: Alt+Space (hold to talk; press to toggle in hands-free mode)
      if (e.altKey && e.code === "Space") {
        e.preventDefault();
        handleToggleMic();
      }

      // Stop TTS / mic: Esc
      if (e.key === "Escape") {
        e.preventDefault();
        // Stop any active speech or listening
        if (micStatus === "listening" || micStatus === "speaking") {
          handleToggleMic();
        }
      }

      // Focus input: Ctrl+L
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        // Focus the input area
        const input = document.querySelector(
          'textarea, input[type="text"]',
        ) as HTMLElement;
        if (input) input.focus();
      }

      // Command palette: Ctrl+/
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // New chat: Ctrl+N
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        handleNewChat();
      }

      // Regenerate: Ctrl+R
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        // Implement regenerate last response
      }

      // Copy last answer: Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        // Copy last AI response to clipboard
      }

      // Zoom: Ctrl+= / Ctrl+- / Ctrl+0
      if (e.ctrlKey && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        // Increase font size
        document.documentElement.style.fontSize =
          parseFloat(getComputedStyle(document.documentElement).fontSize) *
            1.1 +
          "px";
      }

      if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        // Decrease font size
        document.documentElement.style.fontSize =
          parseFloat(getComputedStyle(document.documentElement).fontSize) *
            0.9 +
          "px";
      }

      if (e.ctrlKey && e.key === "0") {
        e.preventDefault();
        // Reset font size
        document.documentElement.style.fontSize = "16px";
      }

      // Toggle captions: Ctrl+Shift+K (avoiding common browser shortcuts)
      if (e.ctrlKey && e.shiftKey && e.key === "K") {
        e.preventDefault();
        // Toggle captions
      }

      // Next region (header/main/sidebars/input): F6
      if (e.key === "F6") {
        e.preventDefault();
        // Cycle through landmarks
        const landmarks = document.querySelectorAll(
          '[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]',
        );
        // Implementation for cycling focus
      }

      // Help: F1
      if (e.key === "F1") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Settings (Ctrl+,)
      if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        handleSettingsOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [micStatus]);

  // PTT (Push-to-Talk) handling - Using Alt+Space for accessibility
  useEffect(() => {
    let isPTTPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "Space" && !isPTTPressed && !micLocked) {
        // Alt+Space for PTT - accessible and won't conflict with normal typing
        e.preventDefault();
        isPTTPressed = true;
        setMicStatus("listening");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "Space" && isPTTPressed) {
        e.preventDefault();
        isPTTPressed = false;
        setMicStatus("processing");

        // Simulate processing delay
        setTimeout(() => {
          setMicStatus("idle");
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [micLocked]);

  const handleGlobalSearch = useCallback((query: string) => {
    console.log("Global search:", query);
    // Implement global search functionality
  }, []);

  const handleNewChat = useCallback(() => {
    const newSession = (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : Date.now().toString();
    localStorage.setItem("vaani.sessionId", newSession);
    setActiveChat(newSession);
    setMessages([]);
    navigate("/chat");
  }, [navigate]);

  const handleTemporaryChat = useCallback(() => {
    const tempChatId = `temp-${Date.now()}`;
    setActiveChat(tempChatId);
    setMessages([
      {
        id: "1",
        type: "assistant",
        content:
          "🕒 **Temporary Chat Mode** - This conversation will not be saved. Perfect for quick questions or when you need privacy!",
        timestamp: new Date(),
        metadata: {
          model: "Vaani-v1",
          confidence: 0.95,
          processingTime: 100,
        },
      },
    ]);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarVisible(!sidebarVisible);
  }, [sidebarVisible]);

  const handleSettingsOpen = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleToggleMic = useCallback(() => {
    if (micLocked) return;
    setMicEnabled(!micEnabled);
    if (micEnabled) {
      setMicStatus("idle");
    }
  }, [micEnabled, micLocked]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled]);

  const handleMicLockToggle = useCallback(() => {
    setMicLocked(!micLocked);
    if (!micLocked) {
      setMicStatus("idle");
    }
  }, [micLocked]);

  const handleChatSelect = useCallback(
    (chatId: string) => {
      setActiveChat(chatId);
      localStorage.setItem("vaani.sessionId", chatId);
      navigate("/chat");
    },
    [navigate],
  );

  const handleChatDelete = useCallback((chatId: string) => {
    console.log("Delete chat:", chatId);
  }, []);

  const handleChatPin = useCallback((chatId: string) => {
    console.log("Pin chat:", chatId);
  }, []);

  const handleChatStar = useCallback((chatId: string) => {
    console.log("Star chat:", chatId);
  }, []);

  const handleSkillToggle = useCallback((skillId: string) => {
    console.log("Toggle skill:", skillId);
  }, []);

  const handleSearchChats = useCallback((query: string) => {
    console.log("Search chats:", query);
  }, []);

  const handleClearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  const handleExportData = useCallback(() => {
    console.log("Export data...");
  }, []);

  const handleImportData = useCallback(() => {
    console.log("Import data...");
  }, []);

  // Global wake word listener (lightweight)
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window))
      return;
    let rec: any = null;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const start = () => {
      const enabled =
        localStorage.getItem("vaani.settings.wakeWord") === "true";
      if (!enabled || rec) return;
      rec = new SpeechRecognition();
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
        ];
        if (wakePhrases.some((p) => transcript.includes(p))) {
          try {
            rec.stop();
          } catch {}
          rec = null;
          window.dispatchEvent(new Event("vaani:wake"));
          setTimeout(start, 500);
        }
      };
      rec.onerror = () => {
        try {
          rec.stop();
        } catch {}
        rec = null;
        setTimeout(start, 1000);
      };
      rec.onend = () => {
        rec = null;
        const enabled2 =
          localStorage.getItem("vaani.settings.wakeWord") === "true";
        if (enabled2) setTimeout(start, 1000);
      };
      try {
        rec.start();
      } catch {}
    };
    start();
    return () => {
      if (rec) {
        try {
          rec.stop();
        } catch {}
        rec = null;
      }
    };
  }, []);

  // Message handlers
  const handleMessageAction = useCallback(
    (messageId: string, action: string, data?: any) => {
      console.log("Message action:", messageId, action, data);
    },
    [],
  );

  const handleMessageRegenerate = useCallback((messageId: string) => {
    console.log("Regenerate message:", messageId);
  }, []);

  const handleMessageContinue = useCallback((messageId: string) => {
    console.log("Continue message:", messageId);
  }, []);

  const handleMessageEdit = useCallback(
    (messageId: string, content: string) => {
      console.log("Edit message:", messageId, content);
    },
    [],
  );

  const handleMessageDelete = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  const handleMessageStar = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg,
      ),
    );
  }, []);

  const handleMessageReact = useCallback(
    (messageId: string, reaction: "thumbsUp" | "thumbsDown") => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [reaction]: !msg.reactions?.[reaction],
                  // Clear opposite reaction
                  [reaction === "thumbsUp" ? "thumbsDown" : "thumbsUp"]: false,
                },
              }
            : msg,
        ),
      );
    },
    [],
  );

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col wcag-targets relative">
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Skip Links for Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <a href="#sidebar-nav" className="skip-link">
          Skip to navigation
        </a>

        {/* Top Bar */}
        <TopBar
          micStatus={micStatus}
          onGlobalSearch={handleGlobalSearch}
          onCommandPalette={() => setCommandPaletteOpen(true)}
          onSettingsOpen={handleSettingsOpen}
          isOnline={isOnline}
          privacyLevel={privacyLevel}
          onPrivacyChange={setPrivacyLevel}
          micLocked={micLocked}
          onMicLockToggle={handleMicLockToggle}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={handleToggleSidebar}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          {sidebarVisible && (
            <LeftSidebar
              chats={chats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onChatDelete={handleChatDelete}
              onChatPin={handleChatPin}
              onChatStar={handleChatStar}
              isVisible={sidebarVisible}
              onToggleVisibility={handleToggleSidebar}
            />
          )}

          {/* Main Content Area */}
          <main
            id="main-content"
            className="flex-1 flex flex-col overflow-hidden"
            role="main"
            aria-label="Conversation area"
          >
            {children || (
              <ConversationTimeline
                messages={messages}
                onMessageAction={handleMessageAction}
                onMessageRegenerate={handleMessageRegenerate}
                onMessageContinue={handleMessageContinue}
                onMessageEdit={handleMessageEdit}
                onMessageDelete={handleMessageDelete}
                onMessageStar={handleMessageStar}
                onMessageReact={handleMessageReact}
                isProcessing={micStatus === "processing"}
              />
            )}
          </main>
        </div>

        {/* Command Palette */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onNewChat={handleNewChat}
          onSettings={handleSettingsOpen}
          onToggleMic={handleToggleMic}
          onToggleSound={handleToggleSound}
          onSearchChats={handleSearchChats}
          onClearHistory={handleClearHistory}
          onExportData={handleExportData}
          onImportData={handleImportData}
          micEnabled={micEnabled}
          soundEnabled={soundEnabled}
        />

        {/* Live Captions */}
        <LiveCaptions
          isVisible={captionsVisible}
          micStatus={micStatus}
          isOnline={isOnline}
          onToggle={() => setCaptionsVisible(!captionsVisible)}
        />

        {/* Settings Dialog */}
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Toast Notifications */}
        <Toaster />
        <Sonner />
      </div>
    </AccessibilityProvider>
  );
}
