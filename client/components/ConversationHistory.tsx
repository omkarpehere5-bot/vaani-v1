import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  History,
  User,
  Bot,
  Trash2,
  Star,
  Volume2,
  Copy,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

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

interface ConversationHistoryProps {
  conversations: ConversationItem[];
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  onReplayMessage: (content: string) => void;
  onSpeakMessage: (content: string) => void;
}

export default function ConversationHistory({
  conversations,
  onClearHistory,
  onToggleFavorite,
  onReplayMessage,
  onSpeakMessage,
}: ConversationHistoryProps) {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    // Hide main sidebar while conversation history panel is open
    let prev: string | null = null;
    try {
      prev = localStorage.getItem('vaani.ui.sidebar.visible');
      localStorage.setItem('vaani.ui.sidebar.visible', 'false');
      window.dispatchEvent(new StorageEvent('storage', { key: 'vaani.ui.sidebar.visible', newValue: 'false' }));
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        if (prev !== null) {
          localStorage.setItem('vaani.ui.sidebar.visible', prev);
          window.dispatchEvent(new StorageEvent('storage', { key: 'vaani.ui.sidebar.visible', newValue: prev }));
        } else {
          localStorage.setItem('vaani.ui.sidebar.visible', 'true');
          window.dispatchEvent(new StorageEvent('storage', { key: 'vaani.ui.sidebar.visible', newValue: 'true' }));
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const filteredConversations = showFavoritesOnly
    ? conversations.filter((conv) => conv.isFavorite)
    : conversations;

  // Deduplicate consecutive duplicates by id+content+time string
  const deduped = (() => {
    const seen = new Set<string>();
    const out: ConversationItem[] = [] as any;
    for (const c of filteredConversations) {
      const key = `${c.id}|${c.content}|${typeof c.timestamp === "string" ? c.timestamp : (c.timestamp as any)?.toString?.()}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(c);
      }
    }
    return out;
  })();

  const handleSpeak = (text: string) => {
    onSpeakMessage(text);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="h-full max-h-[600px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Conversation History
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={showFavoritesOnly ? "text-yellow-500" : ""}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea
          className="h-[500px] px-4"
          style={{ contain: "layout style" }}
        >
          {deduped.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {showFavoritesOnly
                  ? "No favorite conversations yet"
                  : "No conversations yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {deduped.map((conversation, idx) => (
                <div
                  key={`${conversation.id}-${idx}`}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-secondary/50 ${
                    conversation.type === "user" ? "ml-8" : "mr-8"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      conversation.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {conversation.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {conversation.type === "user" ? "You" : "Vaani"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(conversation.timestamp, "HH:mm")}
                        </span>
                        {conversation.voiceData && (
                          <Badge variant="secondary" className="text-xs">
                            Voice • {conversation.voiceData.confidence}%
                            confidence
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleFavorite(conversation.id)}
                          className={`h-6 w-6 p-0 ${conversation.isFavorite ? "text-yellow-500" : ""}`}
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSpeak(conversation.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(conversation.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p
                      className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors"
                      onClick={() =>
                        conversation.type === "user" &&
                        onReplayMessage(conversation.content)
                      }
                      role={conversation.type === "user" ? "button" : undefined}
                      tabIndex={conversation.type === "user" ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (
                          conversation.type === "user" &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          onReplayMessage(conversation.content);
                        }
                      }}
                    >
                      {conversation.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
