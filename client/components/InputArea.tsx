import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mic,
  MicOff,
  Send,
  Square,
  Volume2,
  VolumeX,
  Paperclip,
  Image,
  Camera,
  Settings,
  Globe,
  ChevronDown,
  ChevronUp,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Upload,
  FileText,
  Video,
  Music,
  Headphones,
  Speaker,
  Languages,
  Type,
  Smile,
  AtSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "./AccessibilityModes";
import VoiceWaveform from "./VoiceWaveform";

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  onFileUpload: (files: File[]) => void;
  onImageCapture: () => void;
  onScreenshot: () => void;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  micEnabled: boolean;
  soundEnabled: boolean;
  onMicToggle: () => void;
  onSoundToggle: () => void;
  className?: string;
}

export default function InputArea({
  value,
  onChange,
  onSubmit,
  onVoiceStart,
  onVoiceStop,
  onFileUpload,
  onImageCapture,
  onScreenshot,
  isListening,
  isProcessing,
  isSpeaking,
  micEnabled,
  soundEnabled,
  onMicToggle,
  onSoundToggle,
  className
}: InputAreaProps) {
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'default',
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    language: 'en-US',
    autoSpeak: true,
    noiseReduction: true,
    endOfSpeechTimeout: 1.5
  });
  const [selectedTone, setSelectedTone] = useState('balanced');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [pttMode, setPttMode] = useState<'hold' | 'toggle'>('hold');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings } = useAccessibility();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Focus textarea when not in voice mode
  useEffect(() => {
    if (!isListening && !isProcessing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isListening, isProcessing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
    
    if (e.key === 'Escape') {
      if (isListening) {
        onVoiceStop();
      } else {
        textareaRef.current?.blur();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toneOptions = [
    { value: 'formal', label: 'Formal', description: 'Professional and structured' },
    { value: 'friendly', label: 'Friendly', description: 'Casual and warm' },
    { value: 'technical', label: 'Technical', description: 'Precise and detailed' },
    { value: 'creative', label: 'Creative', description: 'Imaginative and expressive' },
    { value: 'balanced', label: 'Balanced', description: 'Natural and versatile' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'mr', label: 'मराठी', flag: '🇮🇳' }
  ];

  const voiceOptions = [
    { value: 'default', label: 'Default Voice', description: 'Natural and clear' },
    { value: 'neural-male', label: 'Neural Male', description: 'Deep and professional' },
    { value: 'neural-female', label: 'Neural Female', description: 'Warm and friendly' },
    { value: 'expressive', label: 'Expressive', description: 'Dynamic and engaging' }
  ];

  return (
    <div className={cn("border-t border-border bg-card", className)}>
      {/* Voice Panel */}
      <Collapsible open={voicePanelOpen} onOpenChange={setVoicePanelOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto border-b border-border/50"
            aria-label="Toggle voice settings panel"
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Voice & Audio Settings</span>
              {(isListening || isProcessing || isSpeaking) && (
                <Badge variant="secondary" className="ml-2">
                  {isListening ? 'Listening' : isProcessing ? 'Processing' : 'Speaking'}
                </Badge>
              )}
            </div>
            {voicePanelOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="border-b border-border/50">
          <div className="p-4 space-y-6">
            {/* Voice Input Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Input
              </h4>

              <div className="space-y-4">
                {/* Microphone Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Microphone</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onMicToggle}
                      className={cn(
                        "transition-colors",
                        micEnabled ? "bg-green-500/10 text-green-600 border-green-500/20" : ""
                      )}
                    >
                      {micEnabled ? <Mic className="h-3 w-3 mr-1" /> : <MicOff className="h-3 w-3 mr-1" />}
                      {micEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">PTT Mode</label>
                    <div className="flex gap-2">
                      <Button
                        variant={pttMode === 'hold' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPttMode('hold')}
                        className="flex-1"
                      >
                        Hold to Talk
                      </Button>
                      <Button
                        variant={pttMode === 'toggle' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPttMode('toggle')}
                        className="flex-1"
                      >
                        Click to Toggle
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Wake Word</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">"Hey Vaani"</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
                        className={cn(
                          wakeWordEnabled && "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {wakeWordEnabled ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Audio Output Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Audio Output</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onSoundToggle}
                      className={cn(
                        "transition-colors",
                        soundEnabled ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : ""
                      )}
                    >
                      {soundEnabled ? <Volume2 className="h-3 w-3 mr-1" /> : <VolumeX className="h-3 w-3 mr-1" />}
                      {soundEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Captions</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Visual text display</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCaptionsEnabled(!captionsEnabled)}
                        className={cn(
                          captionsEnabled && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        )}
                      >
                        <Type className="h-3 w-3 mr-1" />
                        {captionsEnabled ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Voice Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Speaker className="h-4 w-4" />
                Voice Settings
              </h4>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Voice</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {voiceOptions.find(v => v.value === voiceSettings.voice)?.label}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {voiceOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setVoiceSettings(prev => ({ ...prev, voice: option.value }))}
                          >
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Speech Rate: {voiceSettings.rate.toFixed(1)}x
                    </label>
                    <Slider
                      value={[voiceSettings.rate]}
                      onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, rate: value[0] }))}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Pitch: {voiceSettings.pitch.toFixed(1)}
                    </label>
                    <Slider
                      value={[voiceSettings.pitch]}
                      onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, pitch: value[0] }))}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Volume: {Math.round(voiceSettings.volume * 100)}%
                    </label>
                    <Slider
                      value={[voiceSettings.volume]}
                      onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, volume: value[0] }))}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Voice Waveform (when active) */}
      {(isListening || isProcessing) && (
        <div className="p-4 bg-secondary/20 border-b border-border/50">
          <VoiceWaveform 
            isListening={isListening} 
            isProcessing={isProcessing}
            className="w-full"
          />
          {captionsEnabled && (
            <div className="mt-2 p-2 bg-background border rounded text-sm">
              {isListening ? "Listening for speech..." : "Processing your input..."}
            </div>
          )}
        </div>
      )}

      {/* Main Input Area */}
      <div className="p-4">
        <div className="flex items-end space-x-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or use voice commands..."
              className={cn(
                "min-h-[60px] max-h-[200px] resize-none border-2 transition-colors pr-20",
                "focus:border-primary/50 focus:ring-primary/20",
                settings.dyslexiaFriendly && "font-mono",
                settings.bigControls && "min-h-[80px] text-lg p-4"
              )}
              style={{ 
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineSpacing 
              }}
              disabled={isListening || isProcessing}
              aria-label="Message input"
              aria-describedby="input-help"
            />
            
            {/* Input Actions */}
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              {/* Tone Selector */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Response Tone</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {toneOptions.map((tone) => (
                          <DropdownMenuItem
                            key={tone.value}
                            onClick={() => setSelectedTone(tone.value)}
                            className={selectedTone === tone.value ? "bg-secondary" : ""}
                          >
                            <div>
                              <div className="font-medium">{tone.label}</div>
                              <div className="text-xs text-muted-foreground">{tone.description}</div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>Response tone</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Language Selector */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Languages className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Language</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {languageOptions.map((lang) => (
                          <DropdownMenuItem
                            key={lang.value}
                            onClick={() => setSelectedLanguage(lang.value)}
                            className={selectedLanguage === lang.value ? "bg-secondary" : ""}
                          >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>Select language</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Attachment Controls */}
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-12 w-12"
                    aria-label="Attach files"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach files</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onImageCapture}
                    className="h-12 w-12"
                    aria-label="Capture image"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Take photo</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onScreenshot}
                    className="h-12 w-12"
                    aria-label="Take screenshot"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Screenshot</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Voice/Send Button */}
          <div className="flex items-center space-x-2">
            {/* Voice Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={isListening ? onVoiceStop : onVoiceStart}
                    disabled={!micEnabled || isProcessing}
                    className={cn(
                      "h-12 w-12 rounded-full transition-all duration-200",
                      isListening 
                        ? "bg-red-500 hover:bg-red-600 ptt-active"
                        : "bg-primary hover:bg-primary/90",
                      settings.bigControls && "h-16 w-16"
                    )}
                    aria-label={isListening ? "Stop voice input (Space or Alt+S)" : "Start voice input (Space or Alt+V)"}
                  >
                    {isListening ? (
                      <Square className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isListening ? "Stop listening" : pttMode === 'hold' ? "Hold to talk" : "Click to talk"}
                  <div className="text-xs text-muted-foreground mt-1">
                    {pttMode === 'hold' ? "Or hold Space" : "Or Alt+V"}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Send Button */}
            {value.trim() && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onSubmit}
                      disabled={isProcessing}
                      className={cn(
                        "h-12 w-12 rounded-full",
                        settings.bigControls && "h-16 w-16"
                      )}
                      aria-label="Send message (Enter)"
                    >
                      <Send className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div id="input-help">
            Press <kbd className="px-1 py-0.5 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Enter</kbd> to send,
            <kbd className="px-1 py-0.5 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm ml-1">Shift+Enter</kbd> for new line,
            <kbd className="px-1 py-0.5 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm ml-1">Space</kbd> to talk
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {selectedLanguage.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {selectedTone}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
