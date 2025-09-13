import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Captions, 
  CaptionsOff, 
  Volume2, 
  VolumeX,
  Download,
  Settings,
  User,
  Bot,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  Mic,
  MicOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "./AccessibilityModes";

interface CaptionItem {
  id: string;
  speaker: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  confidence?: number;
  isInterim?: boolean;
}

interface VisualAlert {
  id: string;
  type: 'mic-on' | 'mic-off' | 'connection-loss' | 'completion' | 'error' | 'success';
  message: string;
  timestamp: Date;
  duration?: number;
}

interface LiveCaptionsProps {
  isVisible: boolean;
  micStatus: 'idle' | 'listening' | 'processing' | 'speaking';
  isOnline: boolean;
  currentSpeech?: string;
  onToggle: () => void;
  className?: string;
}

export default function LiveCaptions({
  isVisible,
  micStatus,
  isOnline,
  currentSpeech,
  onToggle,
  className
}: LiveCaptionsProps) {
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [alerts, setAlerts] = useState<VisualAlert[]>([]);
  const [captionSettings, setCaptionSettings] = useState({
    fontSize: 18,
    background: 'dark',
    showSpeakerLabels: true,
    showTimestamps: false,
    autoScroll: true
  });
  
  const captionsRef = useRef<HTMLDivElement>(null);
  const { settings } = useAccessibility();

  // Add new caption
  const addCaption = (speaker: 'user' | 'assistant' | 'system', text: string, isInterim = false) => {
    const newCaption: CaptionItem = {
      id: Date.now().toString(),
      speaker,
      text,
      timestamp: new Date(),
      isInterim
    };

    setCaptions(prev => {
      // Remove previous interim captions from same speaker
      const filtered = prev.filter(cap => !(cap.isInterim && cap.speaker === speaker));
      return [...filtered, newCaption];
    });
  };

  // Add visual alert
  const addAlert = (type: VisualAlert['type'], message: string, duration = 3000) => {
    const alert: VisualAlert = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      duration
    };

    setAlerts(prev => [...prev, alert]);

    // Auto-remove alert after duration
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, duration);
  };

  // Monitor mic status changes for visual alerts
  useEffect(() => {
    switch (micStatus) {
      case 'listening':
        addAlert('mic-on', 'Microphone activated - Listening', 2000);
        break;
      case 'processing':
        addAlert('success', 'Voice input received - Processing', 2000);
        break;
      case 'speaking':
        addAlert('success', 'AI response ready - Speaking', 1000);
        break;
      case 'idle':
        // Don't show alert for returning to idle
        break;
    }
  }, [micStatus]);

  // Monitor connection status
  useEffect(() => {
    if (!isOnline) {
      addAlert('connection-loss', 'Connection lost - Working offline', 5000);
    }
  }, [isOnline]);

  // Auto-scroll captions
  useEffect(() => {
    if (captionSettings.autoScroll && captionsRef.current) {
      captionsRef.current.scrollTop = captionsRef.current.scrollHeight;
    }
  }, [captions, captionSettings.autoScroll]);

  // Handle live speech updates
  useEffect(() => {
    if (currentSpeech && micStatus === 'listening') {
      addCaption('user', currentSpeech, true);
    }
  }, [currentSpeech, micStatus]);

  const getSpeakerIcon = (speaker: 'user' | 'assistant' | 'system') => {
    switch (speaker) {
      case 'user': return <User className="h-3 w-3" />;
      case 'assistant': return <Bot className="h-3 w-3" />;
      case 'system': return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getSpeakerLabel = (speaker: 'user' | 'assistant' | 'system') => {
    switch (speaker) {
      case 'user': return 'You';
      case 'assistant': return 'Vaani';
      case 'system': return 'System';
    }
  };

  const getAlertIcon = (type: VisualAlert['type']) => {
    switch (type) {
      case 'mic-on': return <Mic className="h-4 w-4 text-green-500" />;
      case 'mic-off': return <MicOff className="h-4 w-4 text-red-500" />;
      case 'connection-loss': return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'completion': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const downloadTranscript = () => {
    const transcript = captions
      .filter(cap => !cap.isInterim)
      .map(cap => {
        const time = cap.timestamp.toLocaleTimeString();
        const speaker = getSpeakerLabel(cap.speaker);
        return `[${time}] ${speaker}: ${cap.text}`;
      })
      .join('\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaani-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearCaptions = () => {
    setCaptions([]);
  };

  if (!isVisible) return null;

  return (
    <div className={cn("fixed bottom-20 right-4 w-96 max-w-[90vw] z-50", className)}>
      {/* Visual Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2 mb-4">
          {alerts.map(alert => (
            <Card key={alert.id} className="border-2 border-primary/50 bg-card/95 backdrop-blur">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Live Captions Panel */}
      <Card className={cn(
        "border-2 shadow-xl",
        captionSettings.background === 'dark' ? "bg-black/90 text-white border-white/20" : "bg-white/90 text-black border-black/20"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center space-x-2">
            <Captions className="h-4 w-4" />
            <span className="text-sm font-medium">Live Captions</span>
            <Badge variant="secondary" className="text-xs">
              {captions.length} lines
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Caption Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Caption Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setCaptionSettings(prev => ({ ...prev, background: prev.background === 'dark' ? 'light' : 'dark' }))}
                >
                  Background: {captionSettings.background === 'dark' ? 'Dark' : 'Light'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setCaptionSettings(prev => ({ ...prev, showSpeakerLabels: !prev.showSpeakerLabels }))}
                >
                  {captionSettings.showSpeakerLabels ? '✓' : '○'} Speaker Labels
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setCaptionSettings(prev => ({ ...prev, showTimestamps: !prev.showTimestamps }))}
                >
                  {captionSettings.showTimestamps ? '✓' : '○'} Timestamps
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setCaptionSettings(prev => ({ ...prev, autoScroll: !prev.autoScroll }))}
                >
                  {captionSettings.autoScroll ? '✓' : '○'} Auto Scroll
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={downloadTranscript}>
                  <Download className="mr-2 h-3 w-3" />
                  Download Transcript
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearCaptions}>
                  Clear Captions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
              className="h-6 w-6 p-0"
              aria-label="Close captions"
            >
              <CaptionsOff className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Captions Content */}
        <div 
          ref={captionsRef}
          className="h-64 overflow-y-auto p-3 space-y-2"
          style={{ fontSize: `${captionSettings.fontSize}px` }}
          role="log"
          aria-label="Live captions"
          aria-live="polite"
        >
          {captions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Captions className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Captions will appear here</p>
              <p className="text-xs mt-1">Start speaking or ask Vaani a question</p>
            </div>
          ) : (
            captions.map(caption => (
              <div 
                key={caption.id}
                className={cn(
                  "flex items-start space-x-2 p-2 rounded",
                  caption.isInterim && "opacity-70 italic",
                  caption.speaker === 'user' && "bg-primary/10",
                  caption.speaker === 'assistant' && "bg-secondary/10",
                  caption.speaker === 'system' && "bg-yellow-500/10"
                )}
              >
                {captionSettings.showSpeakerLabels && (
                  <div className="flex items-center space-x-1 min-w-0 flex-shrink-0">
                    {getSpeakerIcon(caption.speaker)}
                    <span className="text-xs font-medium text-muted-foreground">
                      {getSpeakerLabel(caption.speaker)}
                    </span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed break-words">
                    {caption.text}
                  </p>
                  {captionSettings.showTimestamps && (
                    <span className="text-xs text-muted-foreground">
                      {caption.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                {caption.confidence && (
                  <Badge variant="outline" className="text-xs">
                    {Math.round(caption.confidence * 100)}%
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between p-2 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-3 w-3 text-green-500" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500" />
            )}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {micStatus === 'listening' && <Badge variant="secondary" className="text-xs">Recording</Badge>}
            {micStatus === 'processing' && <Badge variant="secondary" className="text-xs">Processing</Badge>}
            {micStatus === 'speaking' && <Badge variant="secondary" className="text-xs">Speaking</Badge>}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Export function to add captions programmatically
export const useLiveCaptions = () => {
  const addCaption = (speaker: 'user' | 'assistant' | 'system', text: string) => {
    // This would be implemented with a context or state management
    console.log(`[${speaker}]: ${text}`);
  };

  return { addCaption };
};
