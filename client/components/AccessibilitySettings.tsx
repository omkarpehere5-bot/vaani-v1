import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Eye, 
  Volume2, 
  Type, 
  Contrast, 
  Keyboard,
  Accessibility
} from "lucide-react";

interface AccessibilitySettingsProps {
  onSettingsChange: (settings: AccessibilityState) => void;
}

export interface AccessibilityState {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  voiceSpeed: number;
  keyboardNavigation: boolean;
  screenReader: boolean;
  textSize: number;
  soundEffects: boolean;
}

export default function AccessibilitySettings({ onSettingsChange }: AccessibilitySettingsProps) {
  const [settings, setSettings] = useState<AccessibilityState>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    voiceSpeed: 1,
    keyboardNavigation: true,
    screenReader: false,
    textSize: 16,
    soundEffects: true,
  });

  const updateSetting = <K extends keyof AccessibilityState>(
    key: K, 
    value: AccessibilityState[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9"
          aria-label="Accessibility settings"
        >
          <Accessibility className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              Accessibility Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex items-center gap-2 text-sm">
                <Contrast className="h-4 w-4" />
                High Contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(value) => updateSetting('highContrast', value)}
              />
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between">
              <Label htmlFor="large-text" className="flex items-center gap-2 text-sm">
                <Type className="h-4 w-4" />
                Large Text
              </Label>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={(value) => updateSetting('largeText', value)}
              />
            </div>

            {/* Text Size */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text Size: {settings.textSize}px
              </Label>
              <Slider
                value={[settings.textSize]}
                onValueChange={(value) => updateSetting('textSize', value[0])}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            {/* Voice Speed */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Voice Speed: {settings.voiceSpeed}x
              </Label>
              <Slider
                value={[settings.voiceSpeed]}
                onValueChange={(value) => updateSetting('voiceSpeed', value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-motion" className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4" />
                Reduce Motion
              </Label>
              <Switch
                id="reduce-motion"
                checked={settings.reduceMotion}
                onCheckedChange={(value) => updateSetting('reduceMotion', value)}
              />
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-nav" className="flex items-center gap-2 text-sm">
                <Keyboard className="h-4 w-4" />
                Enhanced Keyboard Navigation
              </Label>
              <Switch
                id="keyboard-nav"
                checked={settings.keyboardNavigation}
                onCheckedChange={(value) => updateSetting('keyboardNavigation', value)}
              />
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects" className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4" />
                Sound Effects
              </Label>
              <Switch
                id="sound-effects"
                checked={settings.soundEffects}
                onCheckedChange={(value) => updateSetting('soundEffects', value)}
              />
            </div>

            {/* Screen Reader Support */}
            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="flex items-center gap-2 text-sm">
                <Settings className="h-4 w-4" />
                Screen Reader Mode
              </Label>
              <Switch
                id="screen-reader"
                checked={settings.screenReader}
                onCheckedChange={(value) => updateSetting('screenReader', value)}
              />
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
