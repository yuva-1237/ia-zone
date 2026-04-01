import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        toast.success("Account created! Check your email to confirm.");
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 card-shadow">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-card-foreground">
            {isSignUp ? t("login.createAccount") : t("login.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("login.subtitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="fullName">{t("login.fullName")}</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Yuvathilagan" required className="mt-1" />
            </div>
          )}
          <div>
            <Label htmlFor="email">{t("login.email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">{t("login.password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : isSignUp ? t("login.signup") : t("login.signin")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? t("login.hasAccount") : t("login.noAccount")}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary hover:underline">
            {isSignUp ? t("login.signin") : t("login.signup")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
