import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import OnboardingModal from "@/components/OnboardingModal";
import Robot3D from "@/components/Robot3D";
import ThemeAwareFloatingLines from "@/components/ThemeAwareFloatingLines";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import ChatbotPage from "./pages/ChatbotPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, loading } = useAuth();
  const showOnboarding = !loading && user && profile && !profile.onboarding_completed;

  return (
    <div className="relative min-h-screen">
      <ThemeAwareFloatingLines />
      <Robot3D />
      <Navbar />
      {showOnboarding && <OnboardingModal />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/tool/advanced-generalist-ai-assistant" element={<ChatbotPage />} />
        <Route path="/chat/:ccid" element={<ChatbotPage />} />
        <Route path="/chat/:ccid/:slug" element={<ChatbotPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
