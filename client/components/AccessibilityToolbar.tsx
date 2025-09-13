import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Accessibility,
  Type,
  Eye,
  Contrast,
  Volume2,
  Keyboard,
  Monitor,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "./AccessibilityModes";

interface AccessibilityToolbarProps {
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function AccessibilityToolbar({ 
  className, 
  isExpanded = false, 
  onToggle 
}: AccessibilityToolbarProps) {
  const { settings, updateSettings, setMode } = useAccessibility();
  const [currentTheme, setCurrentTheme] = useState('auto');
  
  // Calculate contrast ratio (simplified - real implementation would be more precise)
  const calculateContrast = (bg: string, fg: string): number => {
    // Simplified calculation - in real app, would use proper color contrast algorithm
    return 4.5; // Mock value for demo
  };

  const contrastRatio = calculateContrast('#ffffff', '#000000');
  const isAACompliant = contrastRatio >= 4.5;
  const isAAACompliant = contrastRatio >= 7.0;

  const themes = [
    { id: 'auto', label: 'Auto (OS)', description: 'Matches system preference' },
    { id: 'light', label: 'Light', description: 'Light theme' },
    { id: 'dark', label: 'Dark', description: 'Dark theme' },
    { id: 'high-contrast-black-yellow', label: 'High Contrast Yellow', description: 'Black background, yellow text' },
    { id: 'high-contrast-white-black', label: 'High Contrast White', description: 'Black background, white text' },
    { id: 'color-blind-safe', label: 'Color-Blind Safe', description: 'Blue/orange accents' }
  ];

  const fontSizes = [
    { size: 12, label: 'S' },
    { size: 16, label: 'M' },
    { size: 18, label: 'L' },
    { size: 20, label: 'XL' },
    { size: 24, label: 'XXL' }
  ];

  const applyTheme = (themeId: string) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast-black-yellow', 'high-contrast-white-black', 'color-blind-safe', 'auto');
    
    // Apply new theme
    if (themeId !== 'light') { // light is default
      root.classList.add(themeId);
    }
    
    setCurrentTheme(themeId);
  };

  const resetToDefaults = () => {
    updateSettings({
      fontSize: 18,
      lineSpacing: 1.6,
      focusThickness: 3,
      reduceMotion: false,
      dyslexiaFriendly: false,
      captionsEnabled: false,
      bigControls: false,
      colorBlindFilter: 'none'
    });
    applyTheme('auto');
  };

  return (
    <Card className={cn("accessibility-toolbar", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Accessibility className="h-4 w-4 text-primary" />
            Accessibility Toolbar
            <Badge variant={isAACompliant ? "default" : "destructive"} className="ml-2 text-xs">
              {isAAACompliant ? "AAA" : isAACompliant ? "AA" : "FAIL"}
            </Badge>
          </CardTitle>
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-6 w-6 p-0"
              aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Quick Access Modes */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Quick Access</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.modes.standard ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode('standard')}
                  className="justify-start text-xs"
                >
                  <Monitor className="h-3 w-3 mr-1" />
                  Standard
                </Button>
                <Button
                  variant={settings.modes.lowVision ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode('lowVision')}
                  className="justify-start text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Low Vision
                </Button>
                <Button
                  variant={settings.modes.screenReader ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode('screenReader')}
                  className="justify-start text-xs"
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  Screen Reader
                </Button>
                <Button
                  variant={settings.modes.motorFriendly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode('motorFriendly')}
                  className="justify-start text-xs"
                >
                  <Keyboard className="h-3 w-3 mr-1" />
                  Motor Friendly
                </Button>
                <Button
                  variant={settings.modes.cognitiveLite ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode('cognitiveLite')}
                  className="justify-start text-xs"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Cognitive Lite
                </Button>
                <Button
                  variant={settings.modes.hearingImpaired ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode('hearingImpaired')}
                  className="justify-start text-xs"
                >
                  <Type className="h-3 w-3 mr-1" />
                  Hearing Impaired
                </Button>
              </div>
            </div>

            <Separator />

            {/* Theme Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme & Contrast
              </h4>
              <div className="space-y-2">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={currentTheme === theme.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyTheme(theme.id)}
                    className="justify-start h-auto p-2"
                  >
                    <div className="text-left">
                      <div className="font-medium text-xs">{theme.label}</div>
                      <div className="text-xs text-muted-foreground">{theme.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Current contrast ratio:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{contrastRatio.toFixed(1)}:1</span>
                  {isAACompliant ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Text Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text & Display
              </h4>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Font Size: {settings.fontSize}px</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSettings({ fontSize: Math.max(settings.fontSize - 2, 12) })}
                        className="h-8 w-8 p-0"
                        aria-label="Decrease font size"
                      >
                        <ZoomOut className="h-3 w-3" />
                      </Button>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                        min={12}
                        max={28}
                        step={2}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSettings({ fontSize: Math.min(settings.fontSize + 2, 28) })}
                        className="h-8 w-8 p-0"
                        aria-label="Increase font size"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Line Spacing: {settings.lineSpacing.toFixed(1)}</label>
                    <Slider
                      value={[settings.lineSpacing]}
                      onValueChange={(value) => updateSettings({ lineSpacing: value[0] })}
                      min={1.2}
                      max={2.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Focus Thickness: {settings.focusThickness}px</label>
                    <Slider
                      value={[settings.focusThickness]}
                      onValueChange={(value) => updateSettings({ focusThickness: value[0] })}
                      min={1}
                      max={6}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={settings.dyslexiaFriendly ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ dyslexiaFriendly: !settings.dyslexiaFriendly })}
                      className="text-xs"
                    >
                      Dyslexia Font
                    </Button>
                    <Button
                      variant={settings.bigControls ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ bigControls: !settings.bigControls })}
                      className="text-xs"
                    >
                      Large Controls
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Motion & Visual Effects */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visual Effects
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.reduceMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                  className="text-xs"
                >
                  Reduce Motion
                </Button>
                <Button
                  variant={settings.captionsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ captionsEnabled: !settings.captionsEnabled })}
                  className="text-xs"
                >
                  Captions
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      Color Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Color Vision</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => updateSettings({ colorBlindFilter: 'none' })}>
                      <div className="flex items-center gap-2">
                        {settings.colorBlindFilter === 'none' && <Check className="h-3 w-3" />}
                        None
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateSettings({ colorBlindFilter: 'deuteranopia' })}>
                      <div className="flex items-center gap-2">
                        {settings.colorBlindFilter === 'deuteranopia' && <Check className="h-3 w-3" />}
                        Deuteranopia
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateSettings({ colorBlindFilter: 'protanopia' })}>
                      <div className="flex items-center gap-2">
                        {settings.colorBlindFilter === 'protanopia' && <Check className="h-3 w-3" />}
                        Protanopia
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateSettings({ colorBlindFilter: 'tritanopia' })}>
                      <div className="flex items-center gap-2">
                        {settings.colorBlindFilter === 'tritanopia' && <Check className="h-3 w-3" />}
                        Tritanopia
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Separator />

            {/* Reset Button */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset to Defaults
              </Button>
              
              <div className="text-xs text-muted-foreground">
                Press <kbd className="px-1 py-0.5 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">F1</kbd> for keyboard shortcuts
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
