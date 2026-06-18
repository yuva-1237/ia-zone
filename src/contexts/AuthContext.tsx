import React, { createContext, useContext, useEffect, useState } from "react";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getSession,
  setSession,
  LocalUser,
} from "@/lib/localDB";

// ── Compatible type shapes ────────────────────────────────────────────────────
export interface AppUser {
  id: string;
  email: string;
}

export interface AppSession {
  user: AppUser;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  onboarding_completed: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  session: AppSession | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Pick<Profile, "full_name">>) => Promise<void>;
  completeOnboarding: (fullName: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const toAppUser = (u: LocalUser): AppUser => ({ id: u.id, email: u.email });

const toProfile = (u: LocalUser): Profile => ({
  id: u.id,
  user_id: u.id,
  full_name: u.full_name,
  onboarding_completed: u.onboarding_completed,
});

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSessionState] = useState<AppSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = getSession();
    if (saved) {
      const found = findUserById(saved.user_id);
      if (found) {
        const appUser = toAppUser(found);
        setUser(appUser);
        setSessionState({ user: appUser });
        setProfile(toProfile(found));
      } else {
        setSession(null); // stale session
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    if (findUserByEmail(email)) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = createUser(email, password, fullName);
    const appUser = toAppUser(newUser);
    setSession({ user_id: newUser.id, email: newUser.email });
    setUser(appUser);
    setSessionState({ user: appUser });
    setProfile(toProfile(newUser));
  };

  const signIn = async (email: string, password: string) => {
    const found = findUserByEmail(email);
    if (!found) throw new Error("No account found with this email.");
    if (found.password !== password)
      throw new Error("Incorrect password. Please try again.");
    const appUser = toAppUser(found);
    setSession({ user_id: found.id, email: found.email });
    setUser(appUser);
    setSessionState({ user: appUser });
    setProfile(toProfile(found));
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    setSessionState(null);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<Pick<Profile, "full_name">>) => {
    if (!user) return;
    updateUser(user.id, data);
    const updated = findUserById(user.id);
    if (updated) setProfile(toProfile(updated));
  };

  const completeOnboarding = async (fullName: string) => {
    if (!user) return;
    updateUser(user.id, { full_name: fullName, onboarding_completed: true });
    const updated = findUserById(user.id);
    if (updated) setProfile(toProfile(updated));
  };

  const refreshProfile = async () => {
    if (!user) return;
    const found = findUserById(user.id);
    if (found) setProfile(toProfile(found));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        completeOnboarding,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
