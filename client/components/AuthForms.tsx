import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  UserPlus,
  LogIn,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface AuthFormsProps {
  onLogin?: (email: string, password: string) => void;
  onSignup?: (name: string, email: string, password: string) => void;
  onSocialLogin?: (provider: 'google' | 'github' | 'microsoft') => void;
}

export default function AuthForms({ onLogin, onSignup, onSocialLogin }: AuthFormsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isLogin) {
      onLogin?.(formData.email, formData.password);
    } else {
      // Store the name for profile creation
      if (formData.name) {
        localStorage.setItem('vaaniTempUserName', formData.name);
      }
      onSignup?.(formData.name, formData.email, formData.password);
    }

    setIsLoading(false);
    setIsOpen(false);
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'microsoft') => {
    onSocialLogin?.(provider);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
        >
          <User className="h-4 w-4" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-sm border-0 bg-transparent shadow-none">
        <VisuallyHidden>
          <DialogTitle>Authentication Form</DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse" />
          
          <Card className={cn(
            "relative backdrop-blur-xl bg-card/80 border-white/20 shadow-2xl transition-all duration-700 ease-out",
            "hover:shadow-blue-500/25 hover:shadow-3xl transform-gpu",
            isLogin ? "animate-slide-in-left" : "animate-slide-in-right"
          )}>
            <CardHeader className="text-center pb-2 relative overflow-hidden">
              {/* Sparkle Animation */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-twinkle" />
                <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-twinkle animation-delay-1000" />
                <div className="absolute bottom-4 left-8 w-1 h-1 bg-pink-400 rounded-full animate-twinkle animation-delay-2000" />
              </div>
              
              <div className={cn(
                "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500",
                "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl hover:scale-110"
              )}>
                {isLogin ? (
                  <LogIn className="h-8 w-8 text-white animate-bounce-subtle" />
                ) : (
                  <UserPlus className="h-8 w-8 text-white animate-bounce-subtle" />
                )}
              </div>
              
              <CardTitle className={cn(
                "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500",
                isLogin 
                  ? "from-blue-600 to-purple-600" 
                  : "from-purple-600 to-pink-600"
              )}>
                {isLogin ? "Welcome Back" : "Join Vaani"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isLogin 
                  ? "Sign in to continue your AI journey" 
                  : "Create your account to get started"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (Signup only) */}
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <div className="relative group">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={cn(
                          "pl-4 pr-4 h-10 transition-all duration-300 border-2",
                          "focus:border-purple-500 focus:ring-purple-500/20 focus:ring-4",
                          "group-hover:border-purple-300"
                        )}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2 animate-fade-in animation-delay-100">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={cn(
                        "pl-4 pr-4 h-10 transition-all duration-300 border-2",
                        "focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4",
                        "group-hover:border-blue-300"
                      )}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 animate-fade-in animation-delay-200">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={cn(
                        "pl-4 pr-12 h-10 transition-all duration-300 border-2",
                        "focus:border-green-500 focus:ring-green-500/20 focus:ring-4",
                        "group-hover:border-green-300"
                      )}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-10 mt-6 font-semibold text-white transition-all duration-300 transform",
                    "bg-gradient-to-r hover:scale-105 hover:shadow-lg",
                    isLogin 
                      ? "from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                      : "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
                    isLoading && "animate-pulse cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground font-medium">OR</span>
                <Separator className="flex-1" />
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 hover:bg-red-50 hover:border-red-200 transition-all duration-300 hover:scale-105"
                  onClick={() => handleSocialLogin('google')}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 hover:scale-105"
                  onClick={() => handleSocialLogin('microsoft')}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                  </svg>
                  Continue with Microsoft
                </Button>
              </div>
            </CardContent>

            <CardFooter className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
                  onClick={toggleForm}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
