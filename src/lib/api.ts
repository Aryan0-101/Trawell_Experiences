export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

// Raw base from env (should be like https://your-domain). User might mistakenly include /api or trailing slashes.
const RAW_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5174';
// Normalize: remove trailing slashes
let normalized = RAW_API_BASE.replace(/\/+$/, '');
// If user appended /api, strip it because we add /api in the fetch paths below
if (normalized.toLowerCase().endsWith('/api')) {
  normalized = normalized.slice(0, -4);
}
export const API_BASE = normalized; // exported in case needed elsewhere

// Warn if we accidentally fell back to localhost while not running on localhost (helps catch missing VITE_API_BASE in prod builds)
if (typeof window !== 'undefined') {
  const isLocalhostHost = /^(localhost|127\.|\[::1\])/.test(window.location.hostname);
  const usingLocalApi = API_BASE.includes('localhost');
  if (!isLocalhostHost && usingLocalApi) {
    // eslint-disable-next-line no-console
    console.warn('[API] Using localhost API fallback in a non-local environment. Set VITE_API_BASE to your live API URL and redeploy. Current location:', window.location.origin);
  }
  if (RAW_API_BASE !== API_BASE) {
    // eslint-disable-next-line no-console
    console.info(`[API] Normalized VITE_API_BASE from "${RAW_API_BASE}" to "${API_BASE}"`);
  }
}

export async function upsertUser(user: { name: string; email: string; phone?: string }) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to save user');
  return (await res.json()) as ApiUser;
}

export async function saveQuiz(email: string, answers: Array<{ questionId: number; selectedOptions: string[] }>) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error('Failed to save quiz answers');
  return await res.json();
}

export async function saveStory(email: string, text: string) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}/story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to save story');
  return await res.json();
}

export async function hasQuiz(email: string) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}/quiz/exists`);
  if (!res.ok) throw new Error('Failed to check quiz status');
  const data = await res.json();
  return Boolean(data?.exists);
}

export async function hasStory(email: string) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}/story/exists`);
  if (!res.ok) throw new Error('Failed to check story status');
  const data = await res.json();
  return Boolean(data?.exists);
}

export async function hasEarlyAccess(email: string) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}/early-access/exists`);
  if (!res.ok) throw new Error('Failed to check early access status');
  const data = await res.json();
  return Boolean(data?.exists);
}

export async function joinEarlyAccess(email: string) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}/early-access`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to join early access');
  return await res.json();
}

export async function userSummary(email: string) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}/summary`);
  if (!res.ok) throw new Error('Failed to fetch user summary');
  return await res.json() as { found: boolean; quizCount: number; storyCount: number };
}
