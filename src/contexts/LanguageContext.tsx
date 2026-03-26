import React, { createContext, useContext, useState } from "react";

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.tools": "Tools",
    "nav.history": "History",
    "nav.profile": "Profile",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "tools.title": "AI HUB",
    "tools.subtitle": "Powerful AI assistants to supercharge your learning",
    "tools.explore": "Explore Tool",
    "login.title": "Welcome Back",
    "login.subtitle": "Sign in to access your AI tools",
    "login.email": "Email",
    "login.password": "Password",
    "login.signin": "Sign In",
    "login.signup": "Sign Up",
    "login.noAccount": "Don't have an account?",
    "login.hasAccount": "Already have an account?",
    "login.createAccount": "Create Account",
    "login.fullName": "Full Name",
    "profile.title": "Your Profile",
    "profile.save": "Save Changes",
    "history.title": "Run History",
    "history.resume": "Resume",
    "history.empty": "No tool runs yet. Start using tools to see your history!",
    "onboarding.title": "Welcome to IA ZONE!",
    "onboarding.subtitle": "Let's set up your profile to get started",
    "onboarding.continue": "Get Started",
    "usage.runs": "runs this month",
  },
  ta: {
    "nav.tools": "கருவிகள்",
    "nav.history": "வரலாறு",
    "nav.profile": "சுயவிவரம்",
    "nav.login": "உள்நுழைவு",
    "nav.logout": "வெளியேறு",
    "tools.title": "AI மையம்",
    "tools.subtitle": "உங்கள் கற்றலை மேம்படுத்த சக்திவாய்ந்த AI உதவியாளர்கள்",
    "tools.explore": "கருவியை ஆராயுங்கள்",
    "login.title": "மீண்டும் வரவேற்கிறோம்",
    "login.subtitle": "உங்கள் AI கருவிகளை அணுக உள்நுழையுங்கள்",
    "login.email": "மின்னஞ்சல்",
    "login.password": "கடவுச்சொல்",
    "login.signin": "உள்நுழைக",
    "login.signup": "பதிவு செய்க",
    "login.noAccount": "கணக்கு இல்லையா?",
    "login.hasAccount": "ஏற்கனவே கணக்கு உள்ளதா?",
    "login.createAccount": "கணக்கை உருவாக்கு",
    "login.fullName": "முழு பெயர்",
    "profile.title": "உங்கள் சுயவிவரம்",
    "profile.save": "மாற்றங்களைச் சேமி",
    "history.title": "இயக்க வரலாறு",
    "history.resume": "தொடர்க",
    "history.empty": "இன்னும் கருவி இயக்கங்கள் இல்லை. உங்கள் வரலாற்றைக் காண கருவிகளைப் பயன்படுத்தத் தொடங்குங்கள்!",
    "onboarding.title": "YUVA AI-க்கு வரவேற்கிறோம்!",
    "onboarding.subtitle": "தொடங்க உங்கள் சுயவிவரத்தை அமைக்கலாம்",
    "onboarding.continue": "தொடங்கு",
    "usage.runs": "இந்த மாதம் இயக்கங்கள்",
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem("yuva-lang") || "en");

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("yuva-lang", lang);
  };

  const t = (key: string): string => translations[language]?.[key] || translations.en?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
