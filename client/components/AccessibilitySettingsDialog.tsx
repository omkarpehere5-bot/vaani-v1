import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accessibility,
  Volume2,
  Type,
  Eye,
  Keyboard,
  RotateCcw,
  Save,
  Palette,
  Speaker
} from "lucide-react";
import { useAccessibility } from "./AccessibilityModes";

interface AccessibilitySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccessibilitySettingsDialog({ open, onOpenChange }: AccessibilitySettingsDialogProps) {
  const { settings, updateSettings, setMode, resetToDefaults } = useAccessibility();

  const handleSaveSettings = () => {
    console.log("Accessibility settings saved");
    onOpenChange(false);
  };

  const handleResetSettings = () => {
    resetToDefaults();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] p-0" style={{ contain: 'layout style' }}>
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Accessibility className="h-5 w-5" />
            Accessibility Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Accessibility Modes */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              Quick Accessibility Modes
            </h3>
            <div className="grid grid-cols-3 gap-4" style={{ minHeight: '200px', contain: 'layout' }}>
              {/* First Row */}
              <Button
                variant={settings.modes.standard ? "default" : "outline"}
                onClick={() => setMode('standard')}
                className="h-24 flex flex-col items-center justify-center p-4 text-center accessibility-mode-card"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div className="font-semibold text-sm">Standard</div>
                  <div className="text-xs text-muted-foreground leading-tight">Default settings</div>
                </div>
              </Button>

              <Button
                variant={settings.modes.lowVision ? "default" : "outline"}
                onClick={() => setMode('lowVision')}
                className="h-24 flex flex-col items-center justify-center p-4 text-center accessibility-mode-card"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Type className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="font-semibold text-sm">Low Vision</div>
                  <div className="text-xs text-muted-foreground leading-tight">Large text & contrast</div>
                </div>
              </Button>

              <Button
                variant={settings.modes.screenReader ? "default" : "outline"}
                onClick={() => setMode('screenReader')}
                className="h-24 flex flex-col items-center justify-center p-4 text-center accessibility-mode-card"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Volume2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="font-semibold text-sm">Screen Reader</div>
                  <div className="text-xs text-muted-foreground leading-tight">Voice optimized</div>
                </div>
              </Button>

              {/* Second Row */}
              <Button
                variant={settings.modes.motorFriendly ? "default" : "outline"}
                onClick={() => setMode('motorFriendly')}
                className="h-24 flex flex-col items-center justify-center p-4 text-center accessibility-mode-card"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Keyboard className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="font-semibold text-sm">Motor Friendly</div>
                  <div className="text-xs text-muted-foreground leading-tight">Large controls</div>
                </div>
              </Button>

              <Button
                variant={settings.modes.cognitiveLite ? "default" : "outline"}
                onClick={() => setMode('cognitiveLite')}
                className="h-24 flex flex-col items-center justify-center p-4 text-center accessibility-mode-card"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Palette className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="font-semibold text-sm">Cognitive Lite</div>
                  <div className="text-xs text-muted-foreground leading-tight">Simplified UI</div>
                </div>
              </Button>

              <Button
                variant={settings.modes.hearingImpaired ? "default" : "outline"}
                onClick={() => setMode('hearingImpaired')}
                className="h-24 flex flex-col items-center justify-center p-4 text-center accessibility-mode-card"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="font-semibold text-sm">Hearing Aid</div>
                  <div className="text-xs text-muted-foreground leading-tight">Visual feedback</div>
                </div>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Text & Display Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Type className="h-5 w-5" />
              Text & Display
            </h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Font Size: {settings.fontSize}px</Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                    min={12}
                    max={32}
                    step={1}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label>Line Spacing: {settings.lineSpacing}</Label>
                  <Slider
                    value={[settings.lineSpacing]}
                    onValueChange={(value) => updateSettings({ lineSpacing: value[0] })}
                    min={1}
                    max={2.5}
                    step={0.1}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dyslexia-friendly font</Label>
                    <p className="text-sm text-muted-foreground">Use monospace font for better readability</p>
                  </div>
                  <Switch
                    checked={settings.dyslexiaFriendly}
                    onCheckedChange={(value) => updateSettings({ dyslexiaFriendly: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reduce motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                  </div>
                  <Switch
                    checked={settings.reduceMotion}
                    onCheckedChange={(value) => updateSettings({ reduceMotion: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Large controls</Label>
                    <p className="text-sm text-muted-foreground">Make buttons and controls larger</p>
                  </div>
                  <Switch
                    checked={settings.bigControls}
                    onCheckedChange={(value) => updateSettings({ bigControls: value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* High Contrast & Color Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5" />
              High Contrast & Colors
            </h3>
            
            <div>
              <h4 className="font-medium mb-4 text-slate-900 dark:text-slate-100">High Contrast Themes</h4>
              <div className="space-y-4">
                <Button
                  variant={settings.highContrast === 'none' ? "default" : "outline"}
                  onClick={() => updateSettings({ highContrast: 'none' })}
                  className="w-full h-14 justify-start bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-2 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-900 dark:text-slate-100"
                >
                  <Eye className="h-5 w-5 mr-3 text-slate-700 dark:text-slate-300" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Normal Contrast</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">Standard colors</span>
                  </div>
                </Button>

                <Button
                  variant={settings.highContrast === 'blackYellow' ? "default" : "outline"}
                  onClick={() => updateSettings({ highContrast: 'blackYellow' })}
                  className="w-full h-14 justify-start bg-black text-yellow-300 border-2 border-yellow-400 hover:bg-gray-900 hover:text-yellow-200 transition-all duration-200"
                >
                  <Eye className="h-5 w-5 mr-3 text-yellow-300" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">High Contrast Dark</span>
                    <span className="text-xs text-yellow-400">Black background, yellow text</span>
                  </div>
                </Button>

                <Button
                  variant={settings.highContrast === 'whiteBlack' ? "default" : "outline"}
                  onClick={() => updateSettings({ highContrast: 'whiteBlack' })}
                  className="w-full h-14 justify-start bg-white text-black border-2 border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                >
                  <Eye className="h-5 w-5 mr-3 text-slate-700" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">High Contrast Light</span>
                    <span className="text-xs text-slate-600">White background, black text</span>
                  </div>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Blind Support</Label>
              <Select 
                value={settings.colorBlindFilter} 
                onValueChange={(value: any) => updateSettings({ colorBlindFilter: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Filter</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Audio & Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Speaker className="h-5 w-5" />
              Audio & Voice
            </h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Live captions</Label>
                    <p className="text-sm text-muted-foreground">Show real-time captions</p>
                  </div>
                  <Switch
                    checked={settings.captionsEnabled}
                    onCheckedChange={(value) => updateSettings({ captionsEnabled: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Visual alerts</Label>
                    <p className="text-sm text-muted-foreground">Flash screen for audio alerts</p>
                  </div>
                  <Switch
                    checked={settings.visualAlerts}
                    onCheckedChange={(value) => updateSettings({ visualAlerts: value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Voice Speed: {settings.voiceSpeed}x</Label>
                  <Slider
                    value={[settings.voiceSpeed]}
                    onValueChange={(value) => updateSettings({ voiceSpeed: value[0] })}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Keyboard Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Navigation
            </h3>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enhanced keyboard navigation</Label>
                    <p className="text-sm text-muted-foreground">Better focus indicators and shortcuts</p>
                  </div>
                  <Switch
                    checked={settings.enhancedKeyboard}
                    onCheckedChange={(value) => updateSettings({ enhancedKeyboard: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sticky keys mode</Label>
                    <p className="text-sm text-muted-foreground">Allow modifier keys to stick</p>
                  </div>
                  <Switch
                    checked={settings.stickyKeys}
                    onCheckedChange={(value) => updateSettings({ stickyKeys: value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Focus Thickness: {settings.focusThickness}px</Label>
                  <Slider
                    value={[settings.focusThickness]}
                    onValueChange={(value) => updateSettings({ focusThickness: value[0] })}
                    min={1}
                    max={8}
                    step={1}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
