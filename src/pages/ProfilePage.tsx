import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setFullName(profile.full_name);
  }, [profile]);

  if (!loading && !user) return <Navigate to="/login" replace />;
  if (loading) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Loading...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground">{t("profile.title")}</h1>
      <form onSubmit={handleSave} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="pf-name">{t("login.fullName")}</Label>
          <Input id="pf-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>{t("login.email")}</Label>
          <Input value={user?.email || ""} disabled className="mt-1" />
        </div>
        <Button type="submit" disabled={saving}>{saving ? "..." : t("profile.save")}</Button>
      </form>
    </div>
  );
};

export default ProfilePage;
