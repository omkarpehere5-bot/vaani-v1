import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Accessibility,
  Volume2,
  Mic,
  Monitor,
  Moon,
  Sun,
  Type,
  Keyboard,
  Globe,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Save,
  Languages,
  Palette,
  Eye,
  Speaker,
  Command,
  Info
} from "lucide-react";
import { useAccessibility } from "./AccessibilityModes";
import { useTheme } from "../hooks/use-theme";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommandPalette: () => void;
}

export default function SettingsDialog({ open, onOpenChange, onCommandPalette }: SettingsDialogProps) {
  const { settings, updateSettings, setMode, resetToDefaults } = useAccessibility();
  const { theme, setTheme } = useTheme();

  // General settings
  const [language, setLanguage] = useState("en");
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // Voice settings
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'default',
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    autoSpeak: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    saveHistory: true,
    anonymousMode: false,
    telemetry: true,
    dataRetention: "30days"
  });

  const handleSaveSettings = () => {
    // Save all settings
    console.log("Settings saved");
    onOpenChange(false);
  };

  const handleResetSettings = () => {
    resetToDefaults();
    setTheme("system");
    setLanguage("en");
    setAutoSave(true);
    setNotifications(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="general" className="h-full">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-64 border-r bg-muted/20">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-4">
                  <TabsTrigger
                    value="general"
                    className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-background"
                  >
                    <Monitor className="h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai"
                    className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-background"
                  >
                    <Globe className="h-4 w-4" />
                    AI Provider
                  </TabsTrigger>
                  <TabsTrigger
                    value="voice"
                    className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-background"
                  >
                    <Mic className="h-4 w-4" />
                    Voice & Audio
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-background"
                  >
                    <Palette className="h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="privacy"
                    className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-background"
                  >
                    <Shield className="h-4 w-4" />
                    Privacy
                  </TabsTrigger>
                  <TabsTrigger
                    value="keyboard"
                    className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-background"
                  >
                    <Keyboard className="h-4 w-4" />
                    Keyboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-background"
                  >
                    <Info className="h-4 w-4" />
                    About
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* AI Provider Settings */}
                <TabsContent value="ai" className="p-6 space-y-6 m-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI Provider</h3>
                    <div className="space-y-4 max-w-xl">
                      <div className="space-y-2">
                        <Label>Provider</Label>
                        <Select
                          defaultValue={localStorage.getItem('vaani.ai.provider') || 'gemini'}
                          onValueChange={(val) => localStorage.setItem('vaani.ai.provider', val)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini">Google Gemini</SelectItem>
                            <SelectItem value="openrouter">OpenRouter</SelectItem>
                            <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                            <SelectItem value="bing">Bing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>API Key (stored locally in your browser)</Label>
                        <Input
                          type="password"
                          defaultValue={localStorage.getItem('vaani.ai.apiKey') || ''}
                          onChange={(e) => localStorage.setItem('vaani.ai.apiKey', e.target.value)}
                          placeholder="Paste your API key"
                        />
                        <p className="text-xs text-muted-foreground">Your key is kept in your browser only and sent to the backend for requests. Do not share it.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* General Settings */}
                <TabsContent value="general" className="p-6 space-y-6 m-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="language">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                              <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              variant={theme === 'light' ? 'default' : 'outline'}
                              onClick={() => setTheme('light')}
                              className="w-full flex items-center justify-center"
                            >
                              <Sun className="h-4 w-4 mr-2" />
                              Light
                            </Button>
                            <Button
                              variant={theme === 'dark' ? 'default' : 'outline'}
                              onClick={() => setTheme('dark')}
                              className="w-full flex items-center justify-center"
                            >
                              <Moon className="h-4 w-4 mr-2" />
                              Dark
                            </Button>
                            <Button
                              variant={theme === 'system' ? 'default' : 'outline'}
                              onClick={() => setTheme('system')}
                              className="w-full flex items-center justify-center"
                            >
                              <Monitor className="h-4 w-4 mr-2" />
                              System
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Command Palette</Label>
                            <p className="text-sm text-muted-foreground">Quick access to commands and features</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={onCommandPalette}
                            className="h-9"
                          >
                            <Command className="h-4 w-4 mr-2" />
                            Open (Ctrl+/)
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="auto-save">Auto-save conversations</Label>
                            <p className="text-sm text-muted-foreground">Automatically save your conversations</p>
                          </div>
                          <Switch
                            id="auto-save"
                            checked={autoSave}
                            onCheckedChange={setAutoSave}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notifications">Notifications</Label>
                            <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                          </div>
                          <Switch
                            id="notifications"
                            checked={notifications}
                            onCheckedChange={setNotifications}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>


                {/* Voice & Audio Settings */}
                <TabsContent value="voice" className="p-6 space-y-6 m-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Voice & Audio Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <Speaker className="h-4 w-4" />
                            Voice Output
                          </h4>
                          
                          <div>
                            <Label>Voice: {voiceSettings.voice}</Label>
                            <Select 
                              value={voiceSettings.voice} 
                              onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, voice: value }))}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">Default Voice</SelectItem>
                                <SelectItem value="neural-male">Neural Male</SelectItem>
                                <SelectItem value="neural-female">Neural Female</SelectItem>
                                <SelectItem value="expressive">Expressive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Speech Rate: {voiceSettings.rate.toFixed(1)}x</Label>
                            <Slider
                              value={[voiceSettings.rate]}
                              onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, rate: value[0] }))}
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              className="w-full mt-2"
                            />
                          </div>

                          <div>
                            <Label>Volume: {Math.round(voiceSettings.volume * 100)}%</Label>
                            <Slider
                              value={[voiceSettings.volume]}
                              onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, volume: value[0] }))}
                              min={0}
                              max={1}
                              step={0.1}
                              className="w-full mt-2"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <Mic className="h-4 w-4" />
                            Voice Input
                          </h4>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Auto-speak responses</Label>
                              <p className="text-sm text-muted-foreground">Automatically read AI responses</p>
                            </div>
                            <Switch
                              checked={voiceSettings.autoSpeak}
                              onCheckedChange={(value) => setVoiceSettings(prev => ({ ...prev, autoSpeak: value }))}
                            />
                          </div>

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
                              <Label>Continuous listening</Label>
                              <p className="text-sm text-muted-foreground">Listen without pressing the mic</p>
                            </div>
                            <Switch
                              defaultChecked={localStorage.getItem('vaani.settings.continuous') === 'true'}
                              onCheckedChange={(val) => localStorage.setItem('vaani.settings.continuous', String(Boolean(val)))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Language</Label>
                            <Select
                              defaultValue={localStorage.getItem('vaani.settings.lang') || 'en-US'}
                              onValueChange={(val) => {
                                localStorage.setItem('vaani.settings.lang', val);
                                try {
                                  const short = val.split('-')[0] || 'en';
                                  localStorage.setItem('vaani.ui.lang', short);
                                  // Attempt to notify other tabs
                                  window.dispatchEvent(new StorageEvent('storage', { key: 'vaani.ui.lang', newValue: short }));
                                } catch {}
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en-US">English (US)</SelectItem>
                                <SelectItem value="hi-IN">Hindi (India)</SelectItem>
                                <SelectItem value="mr-IN">Marathi (India)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Wake word</Label>
                              <p className="text-sm text-muted-foreground">Say the phrase to wake Vaani</p>
                            </div>
                            <Switch
                              defaultChecked={localStorage.getItem('vaani.settings.wakeWordEnabled') === 'true'}
                              onCheckedChange={(val) => localStorage.setItem('vaani.settings.wakeWordEnabled', String(Boolean(val)))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Wake word phrase</Label>
                            <Input
                              defaultValue={localStorage.getItem('vaani.settings.wakeWordPhrase') || 'hey vaani'}
                              onChange={(e) => localStorage.setItem('vaani.settings.wakeWordPhrase', e.target.value.toLowerCase())}
                              placeholder="e.g., hey vaani"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="p-6 space-y-6 m-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">High Contrast</h4>
                        <div className="space-y-2">
                          <Button
                            variant={settings.highContrast === 'none' ? "default" : "outline"}
                            onClick={() => updateSettings({ highContrast: 'none' })}
                            className="w-full h-12 justify-start"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Normal Contrast
                          </Button>
                          <Button
                            variant={settings.highContrast === 'blackYellow' ? "default" : "outline"}
                            onClick={() => updateSettings({ highContrast: 'blackYellow' })}
                            className="w-full h-12 justify-start bg-black text-yellow-400 hover:bg-black/90"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            High Contrast (Black/Yellow)
                          </Button>
                          <Button
                            variant={settings.highContrast === 'whiteBlack' ? "default" : "outline"}
                            onClick={() => updateSettings({ highContrast: 'whiteBlack' })}
                            className="w-full h-12 justify-start bg-white text-black border-black hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            High Contrast (White/Black)
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Color Blind Support</h4>
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
                </TabsContent>

                {/* About */}
                <TabsContent value="about" className="p-6 space-y-6 m-0">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <h3>About Vaani</h3>
                    <p>
                      Vaani is a next‑generation AI voice assistant designed for visually impaired, physically handicapped, and normal users to control their PCs hands‑free. It offers online AI mode (Gemini/OpenRouter) and offline fallbacks, with an accessibility‑first design.
                    </p>
                    <h4>Developers</h4>
                    <p>
                      I was created as a Final Year B.E. IT Project by Omkar Vijay Pehere, Harshal Sanjay Pagar, Prerana Bhalerao, and Shraddha Gade from JIT College, Nashik. My purpose is to assist the visually impaired, physically handicapped, and normal users in interacting with their PCs through voice.
                    </p>
                    <h4>Capabilities</h4>
                    <ul>
                      <li>Wake word, continuous listening, STT/TTS, multilingual</li>
                      <li>Contextual chat, reminders, notes, OCR/vision</li>
                      <li>System control (volume/brightness/open/lock), weather</li>
                      <li>High contrast, large controls, screen‑reader friendly</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Privacy Settings */}
                <TabsContent value="privacy" className="p-6 space-y-6 m-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Save conversation history</Label>
                            <p className="text-sm text-muted-foreground">Store conversations locally</p>
                          </div>
                          <Switch
                            checked={privacySettings.saveHistory}
                            onCheckedChange={(value) => setPrivacySettings(prev => ({ ...prev, saveHistory: value }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Anonymous mode</Label>
                            <p className="text-sm text-muted-foreground">Don't associate data with your identity</p>
                          </div>
                          <Switch
                            checked={privacySettings.anonymousMode}
                            onCheckedChange={(value) => setPrivacySettings(prev => ({ ...prev, anonymousMode: value }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Send usage telemetry</Label>
                            <p className="text-sm text-muted-foreground">Help improve Vaani with anonymous usage data</p>
                          </div>
                          <Switch
                            checked={privacySettings.telemetry}
                            onCheckedChange={(value) => setPrivacySettings(prev => ({ ...prev, telemetry: value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Data retention period</Label>
                          <Select 
                            value={privacySettings.dataRetention} 
                            onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, dataRetention: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7days">7 days</SelectItem>
                              <SelectItem value="30days">30 days</SelectItem>
                              <SelectItem value="90days">90 days</SelectItem>
                              <SelectItem value="1year">1 year</SelectItem>
                              <SelectItem value="never">Never delete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Keyboard Settings */}
                <TabsContent value="keyboard" className="p-6 space-y-6 m-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <Card className="p-4">
                          <h4 className="font-medium mb-3">Voice Commands</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Push to Talk</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Alt + Space</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Stop Listening</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Esc</kbd>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h4 className="font-medium mb-3">Navigation</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Command Palette</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Ctrl + /</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>New Chat</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Ctrl + N</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Settings</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Ctrl + ,</kbd>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h4 className="font-medium mb-3">Text Editing</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Send Message</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Enter</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>New Line</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Shift + Enter</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Focus Input</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Ctrl + L</kbd>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h4 className="font-medium mb-3">Accessibility</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Toggle Captions</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">Ctrl + Shift + K</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Navigate Regions</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">F6</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Help</span>
                              <kbd className="px-2 py-1 bg-background border border-black/20 text-foreground rounded text-xs font-medium shadow-sm">F1</kbd>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
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
