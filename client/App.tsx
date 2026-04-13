import "./global.css";

import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccessibilityProvider } from "@/components/AccessibilityModes";
import { VoiceNavigationProvider } from "@/contexts/VoiceNavigationContext";
import MainLayout from "./components/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Onboarding from "./components/Onboarding";
import { suppressResizeObserverErrors } from "@/utils/resize-observer-fix";
import { useState, useEffect } from "react";

// Suppress harmless ResizeObserver errors
suppressResizeObserverErrors();

const queryClient = new QueryClient();

// Default AI provider
if (typeof window !== 'undefined' && !localStorage.getItem('vaani.ai.provider')) {
  localStorage.setItem('vaani.ai.provider', 'gemini');
}

const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Check if onboarding has been completed
    if (localStorage.getItem('vaani.onboarding-complete')) {
      setShowOnboarding(false);
    }
  }, []);

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AccessibilityProvider>
          <VoiceNavigationProvider>
            <UserProvider>
              <AppContent />
            </UserProvider>
          </VoiceNavigationProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
