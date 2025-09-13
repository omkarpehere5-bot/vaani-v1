import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Briefcase, 
  Heart,
  Settings,
  Accessibility,
  Volume2,
  Eye,
  Mic,
  Keyboard,
  Save,
  UserCheck,
  Globe,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface UserProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  timezone: string;
  
  // Professional Information
  occupation: string;
  company: string;
  experience: string;
  
  // Preferences
  preferredLanguage: string;
  voiceSpeed: 'slow' | 'normal' | 'fast';
  voicePitch: 'low' | 'normal' | 'high';
  
  // Accessibility Settings
  isVisuallyImpaired: boolean;
  useScreenReader: boolean;
  useHighContrast: boolean;
  useLargeText: boolean;
  useVoiceNavigation: boolean;
  alwaysListening: boolean;
  
  // Interests and Customization
  interests: string[];
  favoriteTopics: string;
  customCommands: string;
  
  // Privacy Settings
  dataCollection: boolean;
  voiceRecording: boolean;
  personalizedAds: boolean;
}

interface ProfileSetupProps {
  onProfileSave?: (profile: UserProfile) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const availableInterests = [
  "Technology", "Music", "Sports", "Cooking", "Travel", "Reading", 
  "Gaming", "Fitness", "Art", "Science", "Business", "Education",
  "Health", "Movies", "Photography", "Fashion", "Environment"
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "hi", label: "Hindi" },
  { value: "zh", label: "Chinese" },
];

const timezones = [
  { value: "UTC-8", label: "Pacific Time (PST)" },
  { value: "UTC-7", label: "Mountain Time (MST)" },
  { value: "UTC-6", label: "Central Time (CST)" },
  { value: "UTC-5", label: "Eastern Time (EST)" },
  { value: "UTC+0", label: "Greenwich Mean Time (GMT)" },
  { value: "UTC+1", label: "Central European Time (CET)" },
  { value: "UTC+5:30", label: "India Standard Time (IST)" },
];

export default function ProfileSetup({ onProfileSave, isOpen: controlledOpen, onOpenChange }: ProfileSetupProps) {
  const [isOpen, setIsOpen] = useState(controlledOpen || false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    timezone: 'UTC-5',
    occupation: '',
    company: '',
    experience: '',
    preferredLanguage: 'en',
    voiceSpeed: 'normal',
    voicePitch: 'normal',
    isVisuallyImpaired: false,
    useScreenReader: false,
    useHighContrast: false,
    useLargeText: false,
    useVoiceNavigation: false,
    alwaysListening: false,
    interests: [],
    favoriteTopics: '',
    customCommands: '',
    dataCollection: true,
    voiceRecording: true,
    personalizedAds: false,
  });

  const totalSteps = 5;

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onProfileSave?.(profile);
    // Save to localStorage
    localStorage.setItem('vaaniUserProfile', JSON.stringify(profile));
    handleOpenChange(false);
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Let's get to know you better</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => updateProfile('firstName', e.target.value)}
                  placeholder="John"
                  aria-describedby="firstName-desc"
                />
                <span id="firstName-desc" className="sr-only">Enter your first name</span>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => updateProfile('lastName', e.target.value)}
                  placeholder="Doe"
                  aria-describedby="lastName-desc"
                />
                <span id="lastName-desc" className="sr-only">Enter your last name</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                placeholder="john.doe@example.com"
                aria-describedby="email-desc"
              />
              <span id="email-desc" className="sr-only">Enter your email address</span>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                aria-describedby="phone-desc"
              />
              <span id="phone-desc" className="sr-only">Enter your phone number</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                  aria-describedby="dob-desc"
                />
                <span id="dob-desc" className="sr-only">Enter your date of birth</span>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={profile.timezone} onValueChange={(value) => updateProfile('timezone', value)}>
                  <SelectTrigger id="timezone" aria-describedby="timezone-desc">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span id="timezone-desc" className="sr-only">Select your timezone</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Professional Information</h3>
              <p className="text-sm text-muted-foreground">Tell us about your work</p>
            </div>
            
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={profile.occupation}
                onChange={(e) => updateProfile('occupation', e.target.value)}
                placeholder="Software Engineer"
                aria-describedby="occupation-desc"
              />
              <span id="occupation-desc" className="sr-only">Enter your occupation</span>
            </div>
            
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => updateProfile('company', e.target.value)}
                placeholder="Tech Corp Inc."
                aria-describedby="company-desc"
              />
              <span id="company-desc" className="sr-only">Enter your company name</span>
            </div>
            
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Select value={profile.experience} onValueChange={(value) => updateProfile('experience', value)}>
                <SelectTrigger id="experience" aria-describedby="experience-desc">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
              <span id="experience-desc" className="sr-only">Select your years of experience</span>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => updateProfile('location', e.target.value)}
                placeholder="New York, NY"
                aria-describedby="location-desc"
              />
              <span id="location-desc" className="sr-only">Enter your location</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Accessibility className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Accessibility Settings</h3>
              <p className="text-sm text-muted-foreground">Customize Vaani for your needs</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visuallyImpaired"
                  checked={profile.isVisuallyImpaired}
                  onCheckedChange={(checked) => updateProfile('isVisuallyImpaired', checked)}
                />
                <Label htmlFor="visuallyImpaired" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  I am visually impaired
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useScreenReader"
                  checked={profile.useScreenReader}
                  onCheckedChange={(checked) => updateProfile('useScreenReader', checked)}
                />
                <Label htmlFor="useScreenReader" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Enable screen reader support
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useHighContrast"
                  checked={profile.useHighContrast}
                  onCheckedChange={(checked) => updateProfile('useHighContrast', checked)}
                />
                <Label htmlFor="useHighContrast">Use high contrast mode</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useLargeText"
                  checked={profile.useLargeText}
                  onCheckedChange={(checked) => updateProfile('useLargeText', checked)}
                />
                <Label htmlFor="useLargeText">Use large text</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useVoiceNavigation"
                  checked={profile.useVoiceNavigation}
                  onCheckedChange={(checked) => updateProfile('useVoiceNavigation', checked)}
                />
                <Label htmlFor="useVoiceNavigation" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Enable full voice navigation
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alwaysListening"
                  checked={profile.alwaysListening}
                  onCheckedChange={(checked) => updateProfile('alwaysListening', checked)}
                />
                <Label htmlFor="alwaysListening" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Always listen for voice commands
                </Label>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Voice Preferences</h4>
              
              <div>
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select value={profile.preferredLanguage} onValueChange={(value) => updateProfile('preferredLanguage', value)}>
                  <SelectTrigger id="preferredLanguage">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="voiceSpeed">Voice Speed</Label>
                  <Select value={profile.voiceSpeed} onValueChange={(value: any) => updateProfile('voiceSpeed', value)}>
                    <SelectTrigger id="voiceSpeed">
                      <SelectValue placeholder="Select speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="voicePitch">Voice Pitch</Label>
                  <Select value={profile.voicePitch} onValueChange={(value: any) => updateProfile('voicePitch', value)}>
                    <SelectTrigger id="voicePitch">
                      <SelectValue placeholder="Select pitch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Interests & Customization</h3>
              <p className="text-sm text-muted-foreground">Personalize your experience</p>
            </div>
            
            <div>
              <Label>Select Your Interests</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableInterests.map((interest) => (
                  <Button
                    key={interest}
                    type="button"
                    variant={profile.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    className="text-xs w-full"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="favoriteTopics">Favorite Topics</Label>
              <Textarea
                id="favoriteTopics"
                value={profile.favoriteTopics}
                onChange={(e) => updateProfile('favoriteTopics', e.target.value)}
                placeholder="Tell us about topics you'd like to discuss frequently..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="customCommands">Custom Voice Commands</Label>
              <Textarea
                id="customCommands"
                value={profile.customCommands}
                onChange={(e) => updateProfile('customCommands', e.target.value)}
                placeholder="Define custom commands like 'Open my work folder' -> 'C:/Work'"
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Settings className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Privacy & Final Setup</h3>
              <p className="text-sm text-muted-foreground">Configure your privacy preferences</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataCollection"
                  checked={profile.dataCollection}
                  onCheckedChange={(checked) => updateProfile('dataCollection', checked)}
                />
                <Label htmlFor="dataCollection">Allow data collection for service improvement</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="voiceRecording"
                  checked={profile.voiceRecording}
                  onCheckedChange={(checked) => updateProfile('voiceRecording', checked)}
                />
                <Label htmlFor="voiceRecording">Allow voice recording for better recognition</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personalizedAds"
                  checked={profile.personalizedAds}
                  onCheckedChange={(checked) => updateProfile('personalizedAds', checked)}
                />
                <Label htmlFor="personalizedAds">Enable personalized advertisements</Label>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Profile Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Language:</strong> {languages.find(l => l.value === profile.preferredLanguage)?.label}</p>
                <p><strong>Accessibility:</strong> {profile.isVisuallyImpaired ? 'Enhanced for visual impairment' : 'Standard'}</p>
                <p><strong>Interests:</strong> {profile.interests.join(', ') || 'None selected'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Profile Setup - Step {currentStep} of {totalSteps}</DialogTitle>
        </VisuallyHidden>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Profile Setup</h2>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStep()}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === totalSteps ? (
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Profile
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
