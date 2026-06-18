// Local database using localStorage — replaces Supabase for auth & data

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface LocalSession {
  user_id: string;
  email: string;
}

export interface LocalToolRun {
  id: string;
  user_id: string;
  tool_id: string;
  tool_name: string;
  tool_type: string;
  run_id: string;
  created_at: string;
}

const USERS_KEY = "ia_zone_users";
const SESSION_KEY = "ia_zone_session";
const TOOL_RUNS_KEY = "ia_zone_tool_runs";

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = (): LocalUser[] => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
};

const saveUsers = (users: LocalUser[]) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const findUserByEmail = (email: string): LocalUser | null =>
  getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;

export const findUserById = (id: string): LocalUser | null =>
  getUsers().find(u => u.id === id) ?? null;

export const createUser = (
  email: string,
  password: string,
  fullName: string
): LocalUser => {
  const user: LocalUser = {
    id: crypto.randomUUID(),
    email,
    password,
    full_name: fullName,
    onboarding_completed: true,
    created_at: new Date().toISOString(),
  };
  saveUsers([...getUsers(), user]);
  return user;
};

export const updateUser = (id: string, data: Partial<LocalUser>) => {
  saveUsers(getUsers().map(u => (u.id === id ? { ...u, ...data } : u)));
};

// ── Session ──────────────────────────────────────────────────────────────────
export const getSession = (): LocalSession | null => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
};

export const setSession = (session: LocalSession | null) => {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
};

// ── Tool Runs ─────────────────────────────────────────────────────────────────
const getAllRuns = (): LocalToolRun[] => {
  try { return JSON.parse(localStorage.getItem(TOOL_RUNS_KEY) || "[]"); }
  catch { return []; }
};
const saveAllRuns = (runs: LocalToolRun[]) =>
  localStorage.setItem(TOOL_RUNS_KEY, JSON.stringify(runs));

export const getToolRuns = (userId: string): LocalToolRun[] =>
  getAllRuns()
    .filter(r => r.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export const getToolRunByRunId = (runId: string): LocalToolRun | null =>
  getAllRuns().find(r => r.run_id === runId) ?? null;

export const upsertToolRun = (
  run: Omit<LocalToolRun, "id" | "created_at"> & { id?: string }
) => {
  const all = getAllRuns();
  const idx = all.findIndex(r => r.run_id === run.run_id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...run };
  } else {
    all.push({
      ...run,
      id: run.id ?? crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
  }
  saveAllRuns(all);
};

export const updateToolRun = (runId: string, data: Partial<LocalToolRun>) =>
  saveAllRuns(getAllRuns().map(r => (r.run_id === runId ? { ...r, ...data } : r)));

export const deleteToolRunById = (id: string) =>
  saveAllRuns(getAllRuns().filter(r => r.id !== id));

export const deleteAllToolRuns = (userId: string) =>
  saveAllRuns(getAllRuns().filter(r => r.user_id !== userId));
