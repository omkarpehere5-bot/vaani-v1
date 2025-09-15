import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mic,
  Search,
  Settings,
  User,
  LogOut,
  MicOff,
  Wifi,
  WifiOff,
  Shield,
  ShieldOff,
  Command,
  Accessibility,
  Globe,
  Lock,
  Unlock,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "./AccessibilityModes";
import AccessibilityToolbar from "./AccessibilityToolbar";
import AccessibilitySettingsDialog from "./AccessibilitySettingsDialog";
import LocalAccessIndicator from "./LocalAccessIndicator";
import AuthForms from "./AuthForms";
import ProfileSetup from "./ProfileSetup";
import { useTheme } from "../hooks/use-theme";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopBarProps {
  micStatus: 'idle' | 'listening' | 'processing' | 'speaking';
  onGlobalSearch: (query: string) => void;
  onCommandPalette: () => void;
  onSettingsOpen: () => void;
  isOnline: boolean;
  privacyLevel: 'local' | 'cloud' | 'ephemeral';
  onPrivacyChange: (level: 'local' | 'cloud' | 'ephemeral') => void;
  micLocked: boolean;
  onMicLockToggle: () => void;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
}

export default function TopBar({
  micStatus,
  onGlobalSearch,
  onCommandPalette,
  onSettingsOpen,
  isOnline,
  privacyLevel,
  onPrivacyChange,
  micLocked,
  onMicLockToggle,
  sidebarVisible,
  onToggleSidebar
}: TopBarProps) {
  const {
    user,
    isAuthenticated,
    isProfileComplete,
    login,
    logout,
    completeProfile,
    screenReader
  } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAccessibilityDialog, setShowAccessibilityDialog] = useState(false);
  const [showAccessibilityToolbar, setShowAccessibilityToolbar] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const { settings, setMode } = useAccessibility();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const getStatusColor = () => {
    switch (micStatus) {
      case 'listening': return 'bg-red-500';
      case 'processing': return 'bg-yellow-500';
      case 'speaking': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (micStatus) {
      case 'listening': return 'Listening';
      case 'processing': return 'Processing';
      case 'speaking': return 'Speaking';
      default: return '';
    }
  };

  const getPrivacyIcon = () => {
    switch (privacyLevel) {
      case 'local': return <Shield className="h-4 w-4 text-green-500" />;
      case 'cloud': return <ShieldOff className="h-4 w-4 text-yellow-500" />;
      case 'ephemeral': return <Lock className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onGlobalSearch(searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60" role="banner">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Brand and Status */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleSidebar}
                  className="h-8 w-8 p-0"
                  aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
                >
                  {sidebarVisible ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {sidebarVisible ? "Hide sidebar" : "Show sidebar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-3">
            <Mic className="w-5 h-5 text-foreground" />
            <span className="text-xl font-semibold text-foreground">Vaani</span>
          </div>
          {getStatusText() && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {getStatusText()}
            </span>
          )}
        </div>

        {/* Center Section - Spacer */}
        <div className="flex-1"></div>

        {/* Right Section - Controls and Profile */}
        <div className="flex items-center space-x-2">
          {/* Privacy Level Indicator */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                aria-label={`Privacy level: ${privacyLevel}`}
              >
                {getPrivacyIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Privacy Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onPrivacyChange('local')}
                className={privacyLevel === 'local' ? 'bg-secondary' : ''}
              >
                <Shield className="mr-2 h-4 w-4 text-green-500" />
                Local Only
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPrivacyChange('cloud')}
                className={privacyLevel === 'cloud' ? 'bg-secondary' : ''}
              >
                <ShieldOff className="mr-2 h-4 w-4 text-yellow-500" />
                Cloud with History
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPrivacyChange('ephemeral')}
                className={privacyLevel === 'ephemeral' ? 'bg-secondary' : ''}
              >
                <Lock className="mr-2 h-4 w-4 text-blue-500" />
                Ephemeral
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Network Status */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-default">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-green-500" aria-label="Online" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" aria-label="Offline" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isOnline ? t("connected") : t("offline")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Mic Lock */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMicLockToggle}
                  className={cn("h-8 w-8 p-0", micLocked && "text-red-500")}
                  aria-label={micLocked ? "Unlock microphone" : "Lock microphone"}
                >
                  {micLocked ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {micLocked ? "Microphone locked" : "Lock microphone"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Accessibility Quick Access */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  aria-label="Accessibility options"
                  onClick={() => setShowAccessibilityDialog(true)}
                >
                  <Accessibility className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Accessibility Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AccessibilitySettingsDialog
            open={showAccessibilityDialog}
            onOpenChange={setShowAccessibilityDialog}
          />

          {/* Local Access Indicator */}
          <LocalAccessIndicator />

          {/* Language selector */}
          <LanguageSelector />

          {/* Settings */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettingsOpen}
                  className="h-8 w-8 p-0"
                  aria-label="Open settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Settings (Ctrl+,)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Profile / Authentication */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-8 px-2 hover:bg-secondary">
                  <Avatar className="h-7 w-7 border-2 border-primary/20">
                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}{user?.lastName?.charAt(0)?.toUpperCase() || ''}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">
                    {user?.firstName || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}{user?.lastName?.charAt(0)?.toUpperCase() || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">
                        {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email || 'No email'}
                      </p>
                      {!isProfileComplete && (
                        <p className="text-xs text-orange-600 font-medium">
                          Profile incomplete
                        </p>
                      )}
                      {user?.occupation && (
                        <p className="text-xs text-muted-foreground">
                          {user.occupation}
                        </p>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowProfileSetup(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    if (screenReader.isEnabled) {
                      screenReader.speak('Signed out successfully');
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthForms
              onLogin={async (email, password) => {
                const success = await login(email, password);
                if (success && screenReader.isEnabled) {
                  screenReader.speak('Successfully signed in');
                }
              }}
              onSignup={async (name, email, password) => {
                // For signup, we automatically log the user in
                const success = await login(email, password);
                if (success) {
                  // If they don't have a complete profile, show setup
                  const savedProfile = localStorage.getItem('vaaniUserProfile');
                  const profileComplete = localStorage.getItem('vaaniProfileComplete');

                  if (!savedProfile || profileComplete !== 'true') {
                    setTimeout(() => {
                      setShowProfileSetup(true);
                      if (screenReader.isEnabled) {
                        screenReader.speak('Welcome! Please complete your profile setup.');
                      }
                    }, 500);
                  }
                }
              }}
              onSocialLogin={(provider) => {
                console.log('Social login:', provider);
                // Handle social login logic here
              }}
            />
          )}

          {/* Profile Setup Dialog */}
          <ProfileSetup
            isOpen={showProfileSetup}
            onOpenChange={setShowProfileSetup}
            onProfileSave={(profile) => {
              completeProfile(profile);
              setShowProfileSetup(false);
              if (screenReader.isEnabled) {
                screenReader.speak(`Profile completed successfully! Welcome ${profile.firstName}!`);
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
