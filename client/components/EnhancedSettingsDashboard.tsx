import React, { useState } from 'react';
import { useTheme, type ThemeMode } from '@/contexts/ThemeContext';
import { useAccessibility } from './AccessibilityModes';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Palette,
  Volume2,
  Accessibility,
  Settings,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsTabProps {
  icon: React.ReactNode;
  label: string;
  description: string;
}

const SettingsTab: React.FC<SettingsTabProps & { children: React.ReactNode }> = ({
  icon,
  label,
  description,
  children,
}) => (
  <TabsContent value={label.toLowerCase()} className="space-y-6">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-white">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    {children}
  </TabsContent>
);

const EnhancedSettingsDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { theme, updateTheme, setThemeMode } = useTheme();
  const { settings, updateSettings } = useAccessibility();
  const { user, updateProfile } = useUser();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(theme.themeMode);

  const themeOptions: { value: ThemeMode; label: string; description: string }[] = [
    {
      value: 'futuristic-neon',
      label: 'Futuristic Neon',
      description: 'Glassmorphism with neon glow effects',
    },
    {
      value: 'minimal-dark',
      label: 'Minimal Dark',
      description: 'Clean, distraction-free dark interface',
    },
    {
      value: 'high-contrast',
      label: 'High Contrast',
      description: 'Maximum contrast for accessibility',
    },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'mr', label: 'Marathi' },
  ];

  const handleThemeChange = (newTheme: ThemeMode) => {
    setSelectedTheme(newTheme);
    setThemeMode(newTheme);
  };

  const handleFontSizeChange = (size: number[]) => {
    updateSettings({ fontSize: size[0] });
  };

  const handleVoiceSpeedChange = (speed: number[]) => {
    updateSettings({ voiceSpeed: speed[0] });
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window && user?.useScreenReader) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.voiceSpeed;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-3xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white"
            aria-label="Close settings"
          >
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="appearance" className="w-full p-8 space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
              <TabsTrigger value="appearance" className="data-[state=active]:bg-cyan-600">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="voice" className="data-[state=active]:bg-cyan-600">
                <Volume2 className="w-4 h-4 mr-2" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="data-[state=active]:bg-cyan-600">
                <Accessibility className="w-4 h-4 mr-2" />
                Accessibility
              </TabsTrigger>
              <TabsTrigger value="interaction" className="data-[state=active]:bg-cyan-600">
                <Zap className="w-4 h-4 mr-2" />
                Interaction
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <SettingsTab
              icon={<Palette className="w-6 h-6" />}
              label="Appearance"
              description="Customize the look and feel of Vaani"
            >
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleThemeChange(option.value)}
                        className={`p-4 rounded-lg transition-all duration-300 text-left ${
                          selectedTheme === option.value
                            ? 'bg-cyan-600 border-2 border-cyan-400 ring-4 ring-cyan-500/50'
                            : 'bg-slate-700 border-2 border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        <h4 className="font-semibold text-white">{option.label}</h4>
                        <p className="text-sm text-gray-300">{option.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Font Size: {settings.fontSize}px
                    </label>
                    <span className="text-xs text-gray-400">12px - 32px</span>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={handleFontSizeChange}
                    min={12}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                  <p
                    className="text-sm text-gray-400 mt-2"
                    style={{ fontSize: `${settings.fontSize}px` }}
                  >
                    Sample text with your chosen size
                  </p>
                </div>

                {/* Animation Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Enable Animations</label>
                    <p className="text-sm text-gray-400">
                      Smooth transitions and visual effects
                    </p>
                  </div>
                  <Switch
                    checked={theme.enableAnimations}
                    onCheckedChange={(checked) =>
                      updateTheme({ enableAnimations: checked })
                    }
                    aria-label="Toggle animations"
                  />
                </div>

                {/* Glow Effects */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Glow Effects</label>
                    <p className="text-sm text-gray-400">Neon glow and visual highlights</p>
                  </div>
                  <Switch
                    checked={theme.enableGlow}
                    onCheckedChange={(checked) => updateTheme({ enableGlow: checked })}
                    aria-label="Toggle glow effects"
                  />
                </div>
              </div>
            </SettingsTab>

            {/* Voice Tab */}
            <SettingsTab
              icon={<Volume2 className="w-6 h-6" />}
              label="Voice"
              description="Configure voice settings and feedback"
            >
              <div className="space-y-6">
                {/* Voice Speed */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Voice Speed
                    </label>
                    <span className="text-xs text-gray-400">
                      {settings.voiceSpeed.toFixed(1)}x
                    </span>
                  </div>
                  <Slider
                    value={[settings.voiceSpeed]}
                    onValueChange={handleVoiceSpeedChange}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  <Select
                    value={settings.language}
                    onValueChange={(lang: any) =>
                      updateSettings({
                        language: lang,
                      })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Feedback */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Voice Feedback</label>
                    <p className="text-sm text-gray-400">
                      Audible confirmation for actions
                    </p>
                  </div>
                  <Switch
                    checked={theme.voiceFeedback}
                    onCheckedChange={(checked) => updateTheme({ voiceFeedback: checked })}
                    aria-label="Toggle voice feedback"
                  />
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Sound Effects</label>
                    <p className="text-sm text-gray-400">
                      Audio cues for interactions
                    </p>
                  </div>
                  <Switch
                    checked={theme.soundEffects}
                    onCheckedChange={(checked) => updateTheme({ soundEffects: checked })}
                    aria-label="Toggle sound effects"
                  />
                </div>

                {/* Test Voice */}
                <Button
                  onClick={() => speak('Voice test successful. Your settings are configured correctly.')}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  Test Voice
                </Button>
              </div>
            </SettingsTab>

            {/* Accessibility Tab */}
            <SettingsTab
              icon={<Accessibility className="w-6 h-6" />}
              label="Accessibility"
              description="Accessibility modes and visibility settings"
            >
              <div className="space-y-6">
                {/* High Contrast */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    High Contrast Mode
                  </label>
                  <Select
                    value={settings.highContrast}
                    onValueChange={(value: any) =>
                      updateSettings({ highContrast: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="blackYellow">Black & Yellow</SelectItem>
                      <SelectItem value="whiteBlack">White & Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reduce Motion */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Reduce Motion</label>
                    <p className="text-sm text-gray-400">
                      Minimize animations for motion sensitivity
                    </p>
                  </div>
                  <Switch
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) =>
                      updateSettings({ reduceMotion: checked })
                    }
                    aria-label="Toggle reduce motion"
                  />
                </div>

                {/* Big Controls */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Big Controls</label>
                    <p className="text-sm text-gray-400">Larger touch zones and buttons</p>
                  </div>
                  <Switch
                    checked={settings.bigControls}
                    onCheckedChange={(checked) =>
                      updateSettings({ bigControls: checked })
                    }
                    aria-label="Toggle big controls"
                  />
                </div>

                {/* Captions */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Captions</label>
                    <p className="text-sm text-gray-400">
                      Show text captions for audio content
                    </p>
                  </div>
                  <Switch
                    checked={settings.captionsEnabled}
                    onCheckedChange={(checked) =>
                      updateSettings({ captionsEnabled: checked })
                    }
                    aria-label="Toggle captions"
                  />
                </div>
              </div>
            </SettingsTab>

            {/* Interaction Tab */}
            <SettingsTab
              icon={<Zap className="w-6 h-6" />}
              label="Interaction"
              description="Customize interaction behavior and feedback"
            >
              <div className="space-y-6">
                {/* Focus Thickness */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Focus Thickness: {settings.focusThickness}px
                    </label>
                  </div>
                  <Slider
                    value={[settings.focusThickness]}
                    onValueChange={(size) =>
                      updateSettings({ focusThickness: size[0] })
                    }
                    min={1}
                    max={6}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Line Spacing */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Line Spacing: {settings.lineSpacing.toFixed(1)}
                    </label>
                  </div>
                  <Slider
                    value={[settings.lineSpacing]}
                    onValueChange={(spacing) =>
                      updateSettings({ lineSpacing: spacing[0] })
                    }
                    min={1.2}
                    max={2.4}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Dwell Click (for motor impaired) */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Dwell Click</label>
                    <p className="text-sm text-gray-400">
                      Click by hovering (for motor accessibility)
                    </p>
                  </div>
                  <Switch
                    checked={settings.dwellClick}
                    onCheckedChange={(checked) =>
                      updateSettings({ dwellClick: checked })
                    }
                    aria-label="Toggle dwell click"
                  />
                </div>

                {/* Dyslexia Friendly */}
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="font-medium text-white">Dyslexia-Friendly Font</label>
                    <p className="text-sm text-gray-400">
                      Specialized font for better readability
                    </p>
                  </div>
                  <Switch
                    checked={settings.dyslexiaFriendly}
                    onCheckedChange={(checked) =>
                      updateSettings({ dyslexiaFriendly: checked })
                    }
                    aria-label="Toggle dyslexia friendly"
                  />
                </div>
              </div>
            </SettingsTab>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-800 border-t border-slate-700 flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              // Reset to defaults
              localStorage.removeItem('vaani.theme');
              localStorage.removeItem('vaani.userMode');
              window.location.reload();
            }}
            variant="outline"
            className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedSettingsDashboard;
