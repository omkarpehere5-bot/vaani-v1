import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  User,
  Bot,
  MoreHorizontal,
  Copy,
  Volume2,
  VolumeX,
  RefreshCw,
  Share,
  Star,
  StarOff,
  Bookmark,
  Download,
  Edit3,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { useAccessibility } from "./AccessibilityModes";

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
  isStarred?: boolean;
  isBookmarked?: boolean;
  sources?: {
    title: string;
    url: string;
    snippet?: string;
  }[];
  actions?: {
    regenerate?: boolean;
    continue?: boolean;
    edit?: boolean;
  };
  metadata?: {
    model?: string;
    tokens?: number;
    confidence?: number;
    processingTime?: number;
  };
  reactions?: {
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
}

interface ConversationTimelineProps {
  messages: Message[];
  onMessageAction: (messageId: string, action: string, data?: any) => void;
  onMessageRegenerate: (messageId: string) => void;
  onMessageContinue: (messageId: string) => void;
  onMessageEdit: (messageId: string, content: string) => void;
  onMessageDelete: (messageId: string) => void;
  onMessageStar: (messageId: string) => void;
  onMessageReact: (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => void;
  isProcessing?: boolean;
  className?: string;
}

export default function ConversationTimeline({
  messages,
  onMessageAction,
  onMessageRegenerate,
  onMessageContinue,
  onMessageEdit,
  onMessageDelete,
  onMessageStar,
  onMessageReact,
  isProcessing = false,
  className
}: ConversationTimelineProps) {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { settings } = useAccessibility();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages.length]);

  const speakMessage = (messageId: string, content: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      if (speakingMessageId === messageId) {
        setSpeakingMessageId(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = settings.voiceSpeed;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      const rawLang = localStorage.getItem('vaani.settings.lang') || 'en-US';
      utterance.lang = rawLang;
      const voices = speechSynthesis.getVoices();
      const short = rawLang.split('-')[0];
      const byExact = voices.filter((v) => (v.lang || '').toLowerCase() === rawLang.toLowerCase());
      const byPrefix = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(short.toLowerCase()));
      const pick = byExact[0] || byPrefix[0] || voices[0];
      if (pick) utterance.voice = pick;
      utterance.onstart = () => setSpeakingMessageId(messageId);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getMessageIcon = (message: Message) => {
    if (message.type === 'user') {
      return <User className="h-4 w-4" />;
    } else if (message.type === 'system') {
      return <AlertCircle className="h-4 w-4" />;
    } else {
      return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageBgColor = (message: Message) => {
    if (message.type === 'user') {
      return 'bg-primary/10 border-primary/10'; // lighter blue for user's messages
    } else if (message.type === 'system') {
      return 'bg-yellow-500/5 border-yellow-500/20';
    } else if (message.isError) {
      return 'bg-red-500/5 border-red-500/20';
    } else {
      return 'bg-secondary/20 border-border/30'; // lighter assistant background
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'HH:mm');
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isConsecutive = index > 0 && 
      messages[index - 1].type === message.type && 
      (message.timestamp.getTime() - messages[index - 1].timestamp.getTime()) < 300000; // 5 minutes

    return (
      <div
        key={message.id}
        className={cn(
          "group relative",
          message.type === 'user' ? 'ml-12' : 'mr-12',
          !isConsecutive && 'mt-6'
        )}
        role="article"
        aria-label={`Message from ${message.type === 'user' ? 'you' : 'Vaani'} at ${format(message.timestamp, 'HH:mm')}`}
      >
        {/* Message Header (only for non-consecutive messages) */}
        {!isConsecutive && (
          <div className="flex items-center space-x-3 mb-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground'
                : message.type === 'system'
                ? 'bg-yellow-500 text-yellow-50'
                : 'bg-secondary text-secondary-foreground'
            )}>
              {getMessageIcon(message)}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">
                {message.type === 'user' ? 'You' : message.type === 'system' ? 'System' : 'Vaani'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.timestamp)}
              </span>
              {message.metadata?.model && (
                <Badge variant="outline" className="text-xs">
                  {message.metadata.model}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Message Content */}
        <Card className={cn(
          "border transition-colors",
          getMessageBgColor(message),
          selectedMessage === message.id && "ring-2 ring-primary/50",
          settings.modes.screenReader && "focus-within:ring-2 focus-within:ring-primary"
        )}>
          <CardContent className="p-3">
            {/* Message Status Indicators */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {message.isStreaming && (
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Generating...</span>
                  </div>
                )}
                {message.isError && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500">Error</span>
                  </div>
                )}
                {message.metadata?.confidence && (
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(message.metadata.confidence * 100)}% confidence
                  </Badge>
                )}
              </div>
              
              {/* Message Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Quick Actions */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(message.content)}
                        aria-label="Copy message"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => speakMessage(message.id, message.content)}
                        aria-label={speakingMessageId === message.id ? "Stop speaking" : "Speak message"}
                      >
                        {speakingMessageId === message.id ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {speakingMessageId === message.id ? "Stop speaking" : "Read aloud"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onMessageStar(message.id)}
                        aria-label={message.isStarred ? "Remove star" : "Add star"}
                      >
                        {message.isStarred ? (
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {message.isStarred ? "Remove star" : "Add star"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* More Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {message.type === 'assistant' && (
                      <>
                        <DropdownMenuItem onClick={() => onMessageRegenerate(message.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMessageContinue(message.id)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Continue
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onMessageEdit(message.id, message.content)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Quote className="mr-2 h-4 w-4" />
                      Quote
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onMessageDelete(message.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Message Text */}
            <div 
              className={cn(
                "prose prose-sm dark:prose-invert max-w-none text-foreground",
                settings.dyslexiaFriendly && "font-mono"
              )}
              style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
            >
              {message.content.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                </p>
              ))}
            </div>

            {/* Sources/Citations */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Sources:</h4>
                <div className="grid gap-2">
                  {message.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-2 bg-secondary/30 rounded border"
                    >
                      <ExternalLink className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <a
                          href={source.url}
                          className="text-sm font-medium text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.title}
                        </a>
                        {source.snippet && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {source.snippet}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Reactions */}
            {message.type === 'assistant' && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 px-2 text-xs",
                      message.reactions?.thumbsUp && "bg-green-500/20 text-green-600"
                    )}
                    onClick={() => onMessageReact(message.id, 'thumbsUp')}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Good
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 px-2 text-xs",
                      message.reactions?.thumbsDown && "bg-red-500/20 text-red-600"
                    )}
                    onClick={() => onMessageReact(message.id, 'thumbsDown')}
                  >
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Poor
                  </Button>
                </div>

                {/* Metadata */}
                {message.metadata && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {message.metadata.tokens && (
                      <span>{message.metadata.tokens} tokens</span>
                    )}
                    {message.metadata.processingTime && (
                      <span>{message.metadata.processingTime}ms</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={cn("flex-1 flex flex-col", className)} role="main" aria-label="Conversation">
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Start a conversation
              </h3>
              <p className="text-muted-foreground max-w-md">
                Ask Vaani anything or use voice commands to get started. 
                All interactions are designed to be accessible and inclusive.
              </p>
            </div>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
          )}
          
          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Vaani is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Quick scroll to bottom */}
      <div className="flex justify-center pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
              scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
          }}
          className="text-xs"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Jump to latest
        </Button>
      </div>
    </div>
  );
}
