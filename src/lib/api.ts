export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5174';

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
