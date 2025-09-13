import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Plus,
  Search,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Palette,
  Type,
  Eye,
  Keyboard,
  MessageSquare,
  History,
  Star,
  Trash2,
  Download,
  Upload,
  Copy,
  Scissors,
  FileText,
  Calculator,
  Calendar,
  Clock,
  Globe,
  Languages,
  Image,
  Camera,
  Bot,
  Zap,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useAccessibility } from "./AccessibilityModes";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewChat: () => void;
  onSettings: () => void;
  onToggleMic: () => void;
  onToggleSound: () => void;
  onSearchChats: (query: string) => void;
  onClearHistory: () => void;
  onExportData: () => void;
  onImportData: () => void;
  micEnabled: boolean;
  soundEnabled: boolean;
}

export default function CommandPalette({
  open,
  onOpenChange,
  onNewChat,
  onSettings,
  onToggleMic,
  onToggleSound,
  onSearchChats,
  onClearHistory,
  onExportData,
  onImportData,
  micEnabled,
  soundEnabled
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { settings, setMode, updateSettings } = useAccessibility();

  const commands: CommandItem[] = useMemo(() => [
    // Chat & Navigation
    {
      id: "new-chat",
      title: "New Chat",
      description: "Start a new conversation",
      icon: <Plus className="h-4 w-4" />,
      category: "Chat & Navigation",
      shortcut: "Ctrl+N",
      action: onNewChat
    },
    {
      id: "search-chats",
      title: "Search Conversations",
      description: "Find messages in your chat history",
      icon: <Search className="h-4 w-4" />,
      category: "Chat & Navigation",
      shortcut: "Ctrl+/",
      action: () => onSearchChats("")
    },
    {
      id: "view-history",
      title: "View Chat History",
      description: "Browse all conversations",
      icon: <History className="h-4 w-4" />,
      category: "Chat & Navigation",
      shortcut: "Alt+H",
      action: () => {}
    },

    // Voice & Audio
    {
      id: "toggle-mic",
      title: micEnabled ? "Disable Microphone" : "Enable Microphone",
      description: "Toggle microphone access",
      icon: micEnabled ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />,
      category: "Voice & Audio",
      shortcut: "Ctrl+M",
      action: onToggleMic
    },
    {
      id: "toggle-sound",
      title: soundEnabled ? "Mute Sounds" : "Enable Sounds",
      description: "Toggle audio feedback and TTS",
      icon: soundEnabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />,
      category: "Voice & Audio",
      action: onToggleSound
    },
    {
      id: "voice-settings",
      title: "Voice Settings",
      description: "Configure voice speed, pitch, and language",
      icon: <Bot className="h-4 w-4" />,
      category: "Voice & Audio",
      action: onSettings
    },

    // Accessibility
    {
      id: "standard-mode",
      title: "Standard Mode",
      description: "Default accessibility settings",
      icon: <Eye className="h-4 w-4" />,
      category: "Accessibility",
      action: () => setMode('standard')
    },
    {
      id: "low-vision-mode",
      title: "Low Vision Mode",
      description: "High contrast and large text",
      icon: <Eye className="h-4 w-4" />,
      category: "Accessibility",
      action: () => setMode('lowVision')
    },
    {
      id: "screen-reader-mode",
      title: "Screen Reader Mode",
      description: "Optimized for screen readers",
      icon: <BookOpen className="h-4 w-4" />,
      category: "Accessibility",
      action: () => setMode('screenReader')
    },
    {
      id: "motor-friendly-mode",
      title: "Motor Friendly Mode",
      description: "Large targets and scan mode",
      icon: <Keyboard className="h-4 w-4" />,
      category: "Accessibility",
      action: () => setMode('motorFriendly')
    },
    {
      id: "cognitive-lite-mode",
      title: "Cognitive Lite Mode",
      description: "Simplified interface",
      icon: <Zap className="h-4 w-4" />,
      category: "Accessibility",
      action: () => setMode('cognitiveLite')
    },
    {
      id: "hearing-impaired-mode",
      title: "Hearing Impaired Mode",
      description: "Visual feedback and captions",
      icon: <MessageSquare className="h-4 w-4" />,
      category: "Accessibility",
      action: () => setMode('hearingImpaired')
    },
    {
      id: "increase-font",
      title: "Increase Font Size",
      description: "Make text larger",
      icon: <Type className="h-4 w-4" />,
      category: "Accessibility",
      shortcut: "Ctrl+=",
      action: () => updateSettings({ fontSize: Math.min(settings.fontSize + 2, 28) })
    },
    {
      id: "decrease-font",
      title: "Decrease Font Size",
      description: "Make text smaller",
      icon: <Type className="h-4 w-4" />,
      category: "Accessibility",
      shortcut: "Ctrl+-",
      action: () => updateSettings({ fontSize: Math.max(settings.fontSize - 2, 12) })
    },
    {
      id: "toggle-high-contrast",
      title: "Toggle High Contrast",
      description: "Switch between normal and high contrast",
      icon: <Palette className="h-4 w-4" />,
      category: "Accessibility",
      action: () => updateSettings({ 
        highContrast: settings.highContrast === 'none' ? 'blackYellow' : 'none' 
      })
    },
    {
      id: "toggle-motion",
      title: "Toggle Reduced Motion",
      description: "Reduce animations and transitions",
      icon: <Eye className="h-4 w-4" />,
      category: "Accessibility",
      action: () => updateSettings({ reduceMotion: !settings.reduceMotion })
    },

    // Settings & Preferences
    {
      id: "settings",
      title: "Open Settings",
      description: "Configure Vaani preferences",
      icon: <Settings className="h-4 w-4" />,
      category: "Settings & Preferences",
      shortcut: "Ctrl+,",
      action: onSettings
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts",
      description: "View all available shortcuts",
      icon: <Keyboard className="h-4 w-4" />,
      category: "Settings & Preferences",
      shortcut: "Ctrl+?",
      action: () => {}
    },

    // Data Management
    {
      id: "export-data",
      title: "Export Data",
      description: "Download your conversations and settings",
      icon: <Download className="h-4 w-4" />,
      category: "Data Management",
      action: onExportData
    },
    {
      id: "import-data",
      title: "Import Data",
      description: "Import conversations from backup",
      icon: <Upload className="h-4 w-4" />,
      category: "Data Management",
      action: onImportData
    },
    {
      id: "clear-history",
      title: "Clear History",
      description: "Delete all conversation history",
      icon: <Trash2 className="h-4 w-4" />,
      category: "Data Management",
      action: onClearHistory
    },
    {
      id: "copy-last-response",
      title: "Copy Last Response",
      description: "Copy the most recent AI response",
      icon: <Copy className="h-4 w-4" />,
      category: "Data Management",
      shortcut: "Ctrl+Shift+C",
      action: () => {}
    },

    // Tools & Utilities
    {
      id: "calculator",
      title: "Calculator",
      description: "Open quick calculator",
      icon: <Calculator className="h-4 w-4" />,
      category: "Tools & Utilities",
      action: () => {}
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "View calendar and schedule",
      icon: <Calendar className="h-4 w-4" />,
      category: "Tools & Utilities",
      action: () => {}
    },
    {
      id: "timer",
      title: "Set Timer",
      description: "Start a countdown timer",
      icon: <Clock className="h-4 w-4" />,
      category: "Tools & Utilities",
      action: () => {}
    },
    {
      id: "translate",
      title: "Translate Text",
      description: "Translate selected text",
      icon: <Languages className="h-4 w-4" />,
      category: "Tools & Utilities",
      action: () => {}
    },
    {
      id: "take-screenshot",
      title: "Take Screenshot",
      description: "Capture screen for analysis",
      icon: <Camera className="h-4 w-4" />,
      category: "Tools & Utilities",
      action: () => {}
    },
    {
      id: "web-search",
      title: "Web Search",
      description: "Search the internet",
      icon: <Globe className="h-4 w-4" />,
      category: "Tools & Utilities",
      action: () => {}
    },

    // Help & Support
    {
      id: "help",
      title: "Help & Documentation",
      description: "Get help using Vaani",
      icon: <HelpCircle className="h-4 w-4" />,
      category: "Help & Support",
      shortcut: "F1",
      action: () => {}
    },
    {
      id: "tutorial",
      title: "Tutorial",
      description: "Learn how to use Vaani effectively",
      icon: <BookOpen className="h-4 w-4" />,
      category: "Help & Support",
      action: () => {}
    }
  ], [
    micEnabled, 
    soundEnabled, 
    settings, 
    onNewChat, 
    onSettings, 
    onToggleMic, 
    onToggleSound, 
    onSearchChats, 
    onClearHistory, 
    onExportData, 
    onImportData, 
    setMode, 
    updateSettings
  ]);

  const filteredCommands = useMemo(() => {
    if (!searchQuery) return commands;
    
    const query = searchQuery.toLowerCase();
    return commands.filter(command =>
      command.title.toLowerCase().includes(query) ||
      command.description?.toLowerCase().includes(query) ||
      command.category.toLowerCase().includes(query)
    );
  }, [commands, searchQuery]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  // Handle keyboard shortcuts within the command palette
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl" aria-label="Command palette">
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <Command className="rounded-lg border-0 shadow-md">
          <CommandInput
            placeholder="Type a command or search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Search className="mx-auto h-6 w-6 mb-2 opacity-50" />
                No commands found for "{searchQuery}"
              </div>
            </CommandEmpty>
            
            {Object.entries(groupedCommands).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={() => {
                      command.action();
                      onOpenChange(false);
                    }}
                    className="flex items-center justify-between py-3 px-4 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      {command.icon}
                      <div>
                        <div className="font-medium">{command.title}</div>
                        {command.description && (
                          <div className="text-sm text-muted-foreground">
                            {command.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {command.shortcut && (
                      <Badge variant="secondary" className="text-xs">
                        {command.shortcut}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
