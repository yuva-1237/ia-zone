import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, User, History, Globe, Menu, X } from "lucide-react";
import { RobotSVG } from "./Robot3D";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden"
          >
            <RobotSVG isDark={theme === "dark"} className="h-12 w-12 scale-150" />
          </motion.div>
          <span className="font-display text-xl font-bold gradient-text"><span className="font-display text-xl font-bold gradient-text">IA ZONE</span></span>
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
          <Button variant="ghost" size="icon" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
            <Globe className="h-4 w-4" />
          </Button>
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
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <div className="flex flex-col gap-2">
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
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
                <Globe className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            {user ? (
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />{t("nav.logout")}
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">{t("nav.login")}</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
