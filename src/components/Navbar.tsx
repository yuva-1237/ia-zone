import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, User, History, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ta", label: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "hi", label: "Hindi (हिन्दी)", flag: "🇮🇳" },
  { code: "te", label: "Telugu (తెలుగు)", flag: "🇮🇳" },
  { code: "bn", label: "Bengali (বাংলা)", flag: "🇧🇩" },
  { code: "mr", label: "Marathi (मराठी)", flag: "🇮🇳" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)", flag: "🇮🇳" },
  { code: "es", label: "Spanish (Español)", flag: "🇪🇸" },
  { code: "fr", label: "French (Français)", flag: "🇫🇷" },
  { code: "ar", label: "Arabic (العربية)", flag: "🇸🇦" },
  { code: "zh", label: "Chinese (中文)", flag: "🇨🇳" },
  { code: "pt", label: "Portuguese (Português)", flag: "🇧🇷" },
  { code: "ru", label: "Russian (Русский)", flag: "🇷🇺" },
  { code: "ja", label: "Japanese (日本語)", flag: "🇯🇵" },
  { code: "de", label: "German (Deutsch)", flag: "🇩🇪" },
  { code: "ko", label: "Korean (한국어)", flag: "🇰🇷" },
  { code: "it", label: "Italian (Italiano)", flag: "🇮🇹" },
  { code: "tr", label: "Turkish (Türkçe)", flag: "🇹🇷" },
  { code: "vi", label: "Vietnamese (Tiếng Việt)", flag: "🇻🇳" },
  { code: "th", label: "Thai (ไทย)", flag: "🇹🇭" },
  { code: "id", label: "Indonesian (Bahasa)", flag: "🇮🇩" },
  { code: "nl", label: "Dutch (Nederlands)", flag: "🇳🇱" },
  { code: "pl", label: "Polish (Polski)", flag: "🇵🇱" },
  { code: "sv", label: "Swedish (Svenska)", flag: "🇸🇪" },
  { code: "no", label: "Norwegian (Norsk)", flag: "🇳🇴" },
  { code: "da", label: "Danish (Dansk)", flag: "🇩🇰" },
  { code: "fi", label: "Finnish (Suomi)", flag: "🇫🇮" },
  { code: "el", label: "Greek (Ελληνικά)", flag: "🇬🇷" },
  { code: "he", label: "Hebrew (עברית)", flag: "🇮🇱" },
  { code: "ro", label: "Romanian (Română)", flag: "🇷🇴" },
  { code: "hu", label: "Hungarian (Magyar)", flag: "🇭🇺" },
  { code: "cs", label: "Czech (Čeština)", flag: "🇨🇿" },
  { code: "uk", label: "Ukrainian (Українська)", flag: "🇺🇦" },
  { code: "sk", label: "Slovak (Slovenčina)", flag: "🇸🇰" },
  { code: "hr", label: "Croatian (Hrvatski)", flag: "🇭🇷" },
  { code: "bg", label: "Bulgarian (Български)", flag: "🇧🇬" },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 dark:border-white/15">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-background/50 border border-white/10"
          >
            <img src="/favicon.png" alt="IA ZONE Logo" className="h-full w-full object-cover" />
          </motion.div>
          <span className="font-display text-xl font-bold gradient-text">IA ZONE</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/">
            <Button variant="ghost" size="sm">{t("nav.tools")}</Button>
          </Link>
          {user && (
            <>
              <Link to="/history">
                <Button variant="ghost" size="sm">
                  <History className="mr-1 h-4 w-4" />
                  {t("nav.history")}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="mr-1 h-4 w-4" />
                  {t("nav.profile")}
                </Button>
              </Link>
            </>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 h-9 px-3"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden lg:inline-block">
                  {languages.find((l) => l.code === language)?.label || "English"}
                </span>
                <ChevronsUpDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <Command>
                <CommandInput placeholder={t("nav.searchLanguage")} className="h-9" />
                <CommandList>
                  <CommandEmpty>{t("nav.noLanguage")}</CommandEmpty>
                  <CommandGroup>
                    {languages.map((lang) => (
                      <CommandItem
                        key={lang.code}
                        value={lang.label}
                        onSelect={() => {
                          setLanguage(lang.code);
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        <Check
                          className={`h-4 w-4 ${
                            language === lang.code ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-1 h-4 w-4" />
              {t("nav.logout")}
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm">{t("nav.login")}</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-border bg-background p-4 md:hidden flex flex-col gap-2"
          >
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">{t("nav.tools")}</Button>
            </Link>
            {user && (
              <>
                <Link to="/history" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" />{t("nav.history")}
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />{t("nav.profile")}
                  </Button>
                </Link>
              </>
            )}
            
            <div className="py-2">
              <Command className="rounded-lg border shadow-md bg-white/5 border-white/10">
                <CommandInput placeholder={t("nav.searchLanguage")} className="h-9" />
                <CommandList className="max-h-[200px]">
                  <CommandEmpty>{t("nav.noLanguage")}</CommandEmpty>
                  <CommandGroup>
                    {languages.map((lang) => (
                      <CommandItem
                        key={lang.code}
                        value={lang.label}
                        onSelect={() => {
                          setLanguage(lang.code);
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm">{lang.label}</span>
                        </div>
                        <Check
                          className={`h-4 w-4 ${
                            language === lang.code ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-full justify-start px-3">
                {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
              </Button>
            </div>
            {user ? (
              <Button variant="outline" onClick={handleSignOut} className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />{t("nav.logout")}
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">{t("nav.login")}</Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
