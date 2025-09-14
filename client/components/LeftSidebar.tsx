import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MessageSquare,
  Pin,
  Folder,
  History,
  Zap,
  Puzzle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  Edit3,
  Clock,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

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

interface LeftSidebarProps {
  chats: ChatItem[];
  activeChat?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onChatDelete: (chatId: string) => void;
  onChatPin: (chatId: string) => void;
  onChatStar: (chatId: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function LeftSidebar({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onChatDelete,
  onChatPin,
  onChatStar,
  isVisible,
  onToggleVisibility,
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(
    () => localStorage.getItem("vaani.settings.wakeWord") === "true",
  );
  const [foldersExpanded, setFoldersExpanded] = useState<
    Record<string, boolean>
  >({
    favorites: true,
    recent: true,
  });
  const [localChats, setLocalChats] = useState<ChatItem[]>(() => {
    try {
      const raw = localStorage.getItem("vaani.chats");
      if (!raw) return [];
      const arr = JSON.parse(raw) as any[];
      return arr.map((c, i) => ({
        id: c.id || `local-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: c.title || "New Chat",
        lastMessage: c.lastMessage || "",
        timestamp: new Date(c.timestamp || Date.now()),
        isPinned: !!c.isPinned,
        isStarred: !!c.isStarred,
        messageCount: c.messageCount || 0,
        folder: c.folder,
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "vaani.chats") {
        try {
          const arr = JSON.parse(e.newValue || "[]");
          setLocalChats(
            arr.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })),
          );
        } catch {}
      }
      if (e.key === "vaani.settings.wakeWord") {
        setWakeWordEnabled(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sourceChats = localChats.length ? localChats : chats;

  const filteredChats = sourceChats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupChatsByFavorites = (list: ChatItem[]) => ({
    favorites: list.filter((chat) => chat.isStarred),
    recent: list.filter((chat) => !chat.isStarred),
  });

  const chatGroups = groupChatsByFavorites(filteredChats);

  const toggleFolder = (folder: string) => {
    setFoldersExpanded((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const formatChatTime = (date: Date) => {
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM d");
  };

  const renderChatItem = (chat: ChatItem, idx: number) => (
    <div
      key={chat.id || `chat-${idx}-${chat.timestamp?.valueOf?.() || Date.now()}`}
      className={cn(
        "group flex items-center p-3 gap-3 rounded-lg cursor-pointer transition-colors mx-2",
        "hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none",
        activeChat === chat.id && "bg-secondary border border-primary/20",
      )}
      style={{ width: '36px', alignSelf: 'center' }}
      onClick={() => onChatSelect(chat.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onChatSelect(chat.id);
        }
      }}
      aria-label={`Chat: ${chat.title}, ${chat.messageCount} messages, last activity ${formatChatTime(chat.timestamp)}`}
    >
      <div className="flex items-center space-x-3 w-full min-w-0">
        <div className="flex-shrink-0">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-medium text-foreground pr-2 truncate max-w-[14rem]">
              {chat.title}
            </h4>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {chat.isPinned && <Pin className="h-4 w-4 text-primary" />}
              {chat.isStarred && <Star className="h-4 w-4 text-yellow-500" />}
              <button
                aria-label="Rename chat"
                title="Rename"
                onClick={(e) => {
                  e.stopPropagation();
                  const newTitle = prompt("Rename chat", chat.title)?.trim();
                  if (newTitle) {
                    try {
                      const raw = localStorage.getItem("vaani.chats");
                      const arr = raw ? (JSON.parse(raw) as any[]) : [];
                      const idx = arr.findIndex((c: any) => c.id === chat.id);
                      if (idx >= 0) {
                        arr[idx].title = newTitle;
                        localStorage.setItem("vaani.chats", JSON.stringify(arr));
                        window.dispatchEvent(
                          new StorageEvent("storage", {
                            key: "vaani.chats",
                            newValue: JSON.stringify(arr),
                          }),
                        );
                      }
                    } catch {}
                  }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="h-3 w-3" />
              </button>

              <button
                aria-label="Delete chat"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!confirm('Delete this conversation?')) return;
                  try {
                    const raw = localStorage.getItem('vaani.chats');
                    const arr = raw ? (JSON.parse(raw) as any[]) : [];
                    const idx = arr.findIndex((c: any) => c.id === chat.id);
                    if (idx >= 0) {
                      arr.splice(idx, 1);
                      localStorage.setItem('vaani.chats', JSON.stringify(arr));
                      window.dispatchEvent(new StorageEvent('storage', { key: 'vaani.chats', newValue: JSON.stringify(arr) }));
                    }
                    // Also remove conversations
                    localStorage.removeItem(`vaani.conversations.${chat.id}`);
                    window.dispatchEvent(new StorageEvent('storage', { key: `vaani.conversations.${chat.id}`, newValue: null }));
                  } catch {}
                  onChatDelete(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate pr-8 max-w-full">
            {chat.lastMessage}
          </p>
          <div className="flex items-center justify-between mt-2 gap-2">
            <Badge variant="secondary" className="text-xs">
              {chat.messageCount} msgs
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatChatTime(chat.timestamp)}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onChatPin(chat.id)}>
              <Pin className="mr-2 h-4 w-4" />
              {chat.isPinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                try {
                  const raw = localStorage.getItem("vaani.chats");
                  const arr = raw ? (JSON.parse(raw) as any[]) : [];
                  const idx = arr.findIndex((c: any) => c.id === chat.id);
                  if (idx >= 0) {
                    arr[idx].isStarred = !arr[idx].isStarred;
                    localStorage.setItem("vaani.chats", JSON.stringify(arr));
                    window.dispatchEvent(
                      new StorageEvent("storage", {
                        key: "vaani.chats",
                        newValue: JSON.stringify(arr),
                      }),
                    );
                  }
                } catch {}
                onChatStar(chat.id);
              }}
            >
              <Star className="mr-2 h-4 w-4" />
              {chat.isStarred ? "Unstar" : "Star"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const newTitle = prompt("Rename chat", chat.title)?.trim();
                if (newTitle) {
                  try {
                    const raw = localStorage.getItem("vaani.chats");
                    const arr = raw ? (JSON.parse(raw) as any[]) : [];
                    const idx = arr.findIndex((c: any) => c.id === chat.id);
                    if (idx >= 0) {
                      arr[idx].title = newTitle;
                      localStorage.setItem("vaani.chats", JSON.stringify(arr));
                      window.dispatchEvent(
                        new StorageEvent("storage", {
                          key: "vaani.chats",
                          newValue: JSON.stringify(arr),
                        }),
                      );
                    }
                  } catch {}
                }
              }}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChatDelete(chat.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const renderChatGroup = (title: string, chats: ChatItem[], key: string) => {
    if (chats.length === 0) return null;

    return (
      <Collapsible
        key={key}
        open={foldersExpanded[key]}
        onOpenChange={() => toggleFolder(key)}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between p-2 h-auto font-medium text-sm mx-1"
            style={{ width: '36%' }}
          >
            <span className="flex items-center gap-2">
              {key === "favorites" && (
                <Star className="h-4 w-4 text-yellow-500" />
              )}
              {key === "recent" && <MessageSquare className="h-4 w-4" />}
              {title} ({chats.length})
            </span>
            {foldersExpanded[key] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          <div style={{ width: '36px', height: '400px' }}>
            {chats.map((c, i) => renderChatItem(c, i))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside
      className="w-96 border-r border-border bg-card h-screen flex flex-col"
      role="navigation"
      aria-label="Chat navigation"
    >
      <div className="p-4 space-y-3 flex-shrink-0">
        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Primary Actions - Aligned Left */}
          <div className="grid grid-cols-1 gap-2">
            {/* New Chat Button */}
            <Button
              onClick={onNewChat}
              className="w-full justify-start h-12 text-base px-4 font-medium"
              size="lg"
              accessKey="n"
              aria-label="New Chat (Alt+N or Ctrl+N)"
            >
              <div className="flex items-center gap-3 flex-1">
                <Plus className="h-4 w-4" />
                <span>
                  <span className="underline decoration-transparent">N</span>ew
                  Chat
                </span>
              </div>
              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm ml-auto">
                Alt+N
              </kbd>
            </Button>
          </div>
        </div>

        {/* Chat Search */}
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="h-12 px-4 border border-border rounded-lg bg-background font-medium"
            aria-label="Search conversations"
          />
        </div>

        {/* Wake Word Toggle */}
        <Button
          onClick={() => {
            const next = !wakeWordEnabled;
            setWakeWordEnabled(next);
            localStorage.setItem(
              "vaani.settings.wakeWord",
              next ? "true" : "false",
            );
            try {
              window.dispatchEvent(
                new StorageEvent("storage", {
                  key: "vaani.settings.wakeWord",
                  newValue: next ? "true" : "false",
                }),
              );
            } catch {}
          }}
          variant="outline"
          className={`w-full h-12 justify-between p-4 transition-all duration-200 ${
            wakeWordEnabled
              ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
              : "border-orange-300 text-orange-700 hover:bg-orange-50"
          }`}
          aria-label={`Wake word is ${wakeWordEnabled ? "enabled" : "disabled"}. Click to ${wakeWordEnabled ? "disable" : "enable"}.`}
        >
          <div className="flex items-center gap-3">
            <Zap
              className={`h-4 w-4 ${wakeWordEnabled ? "text-green-600" : "text-orange-600"}`}
            />
            <span className="text-base font-medium">Wake Word</span>
          </div>
          <div
            className={`px-3 py-1 rounded text-sm font-bold ${
              wakeWordEnabled
                ? "bg-green-200 text-green-800"
                : "bg-orange-200 text-orange-800"
            }`}
          >
            {wakeWordEnabled ? "ON" : "OFF"}
          </div>
        </Button>
      </div>

      <Separator />

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" style={{ contain: "layout style" }}>
          <div className="px-3 py-4 space-y-4">
            {renderChatGroup("Favorites", chatGroups.favorites, "favorites")}
            {renderChatGroup("Recent Chats", chatGroups.recent, "recent")}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
