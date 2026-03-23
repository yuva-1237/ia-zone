import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const OnboardingModal = () => {
  const { completeOnboarding } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setLoading(true);
    try {
      await completeOnboarding(fullName.trim());
      toast.success("Welcome to YUVA AI!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl border border-border bg-card p-8 card-shadow">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-card-foreground">{t("onboarding.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("onboarding.subtitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="onb-name">{t("login.fullName")}</Label>
            <Input
              id="onb-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Yuvathilagan"
              required
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !fullName.trim()}>
            {loading ? "..." : t("onboarding.continue")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;
