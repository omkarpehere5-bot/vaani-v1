import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Palette, Volume2, Shield, Zap } from 'lucide-react';
import GlassCard from './GlassCard';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PremiumSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (key: string, value: any) => void;
}

const tabs: SettingsTab[] = [
  { id: 'appearance', label: 'Appearance', icon: <Palette size={20} /> },
  { id: 'voice', label: 'Voice', icon: <Volume2 size={20} /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield size={20} /> },
  { id: 'advanced', label: 'Advanced', icon: <Zap size={20} /> },
];

const PremiumSettingsModal: React.FC<PremiumSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsChange,
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    theme: 'dark',
    animationsEnabled: true,
    glowEffects: true,
    voiceSpeed: 1,
    language: 'en',
    dataCollection: false,
    analytics: false,
    notifications: true,
    darkMode: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    onSettingsChange?.(key, value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            {/* Theme toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="text-white font-medium">Dark Mode</h4>
                <p className="text-white/60 text-sm">Enable for premium look</p>
              </div>
              <motion.button
                onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  settings.darkMode ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  layout
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: settings.darkMode ? 20 : 2 }}
                />
              </motion.button>
            </div>

            {/* Animations toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="text-white font-medium">Animations</h4>
                <p className="text-white/60 text-sm">Smooth transitions</p>
              </div>
              <motion.button
                onClick={() => handleSettingChange('animationsEnabled', !settings.animationsEnabled)}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  settings.animationsEnabled ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  layout
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: settings.animationsEnabled ? 20 : 2 }}
                />
              </motion.button>
            </div>

            {/* Glow effects toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="text-white font-medium">Glow Effects</h4>
                <p className="text-white/60 text-sm">Neon highlights</p>
              </div>
              <motion.button
                onClick={() => handleSettingChange('glowEffects', !settings.glowEffects)}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  settings.glowEffects ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  layout
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: settings.glowEffects ? 20 : 2 }}
                />
              </motion.button>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            {/* Voice speed */}
            <div>
              <h4 className="text-white font-medium mb-3">Voice Speed: {settings.voiceSpeed.toFixed(1)}x</h4>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => handleSettingChange('voiceSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/40 mt-2">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Language */}
            <div>
              <h4 className="text-white font-medium mb-3">Language</h4>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none cursor-pointer hover:bg-white/15 transition-colors"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            {/* Notifications toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="text-white font-medium">Notifications</h4>
                <p className="text-white/60 text-sm">Enable sound alerts</p>
              </div>
              <motion.button
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  settings.notifications ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  layout
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: settings.notifications ? 20 : 2 }}
                />
              </motion.button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            {/* Data collection */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="text-white font-medium">Data Collection</h4>
                <p className="text-white/60 text-sm">Help improve Vaani</p>
              </div>
              <motion.button
                onClick={() => handleSettingChange('dataCollection', !settings.dataCollection)}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  settings.dataCollection ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  layout
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: settings.dataCollection ? 20 : 2 }}
                />
              </motion.button>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="text-white font-medium">Analytics</h4>
                <p className="text-white/60 text-sm">Anonymous usage stats</p>
              </div>
              <motion.button
                onClick={() => handleSettingChange('analytics', !settings.analytics)}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  settings.analytics ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  layout
                  className="w-5 h-5 rounded-full bg-white"
                  animate={{ x: settings.analytics ? 20 : 2 }}
                />
              </motion.button>
            </div>

            <GlassCard variant="subtle" className="p-4">
              <p className="text-xs text-white/60">
                Your privacy is important to us. Data is encrypted and never shared with third parties.
              </p>
            </GlassCard>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <GlassCard variant="subtle" className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium">Version</h4>
                  <p className="text-white/60 text-sm">Vaani 2.0 Premium</p>
                </div>
                <div>
                  <h4 className="text-white font-medium">Last Updated</h4>
                  <p className="text-white/60 text-sm">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </GlassCard>

            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/50 text-white hover:from-cyan-500/40 hover:to-blue-500/40 transition-all">
              Clear Cache
            </button>

            <button className="w-full px-4 py-2 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 transition-all">
              Reset to Defaults
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <GlassCard className="w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Settings size={24} className="text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={24} className="text-white/60" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 px-6 pt-4 overflow-x-auto border-b border-white/10">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-t-lg whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 border-b-2 border-cyan-400 text-cyan-300'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto p-6"
              >
                {renderTabContent()}
              </motion.div>

              {/* Footer */}
              <div className="flex gap-4 p-6 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-glow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumSettingsModal;
