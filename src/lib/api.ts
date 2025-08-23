// Supabase-based implementation replacing custom Express backend.
import { supabase } from './supabase';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  early_access_applied?: boolean;
  early_access_at?: string | null;
}

async function getUserId(email: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function upsertUser(user: { name: string; email: string; phone?: string }) {
  const payload = { ...user, email: user.email.toLowerCase() };
  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'email' })
    .select()
    .single();
  if (error) throw error;
  return data as ApiUser;
}

export async function saveQuiz(email: string, answers: Array<{ questionId: number; selectedOptions: string[] }>) {
  const userId = await getUserId(email);
  if (!userId) throw new Error('User not found');
  const del = await supabase.from('quiz_answers').delete().eq('user_id', userId);
  if (del.error) throw del.error;
  if (answers.length === 0) return { ok: true };
  const rows = answers.map(a => ({
    user_id: userId,
    question_id: a.questionId,
    selected_options: a.selectedOptions
  }));
  const { error } = await supabase.from('quiz_answers').insert(rows);
  if (error) throw error;
  return { ok: true };
}

export async function saveStory(email: string, text: string) {
  const userId = await getUserId(email);
  if (!userId) throw new Error('User not found');
  // For single story per user: delete then insert
  const del = await supabase.from('stories').delete().eq('user_id', userId);
  if (del.error) throw del.error;
  const { data, error } = await supabase.from('stories').insert({ user_id: userId, text }).select().single();
  if (error) throw error;
  return { replaced: del.count && del.count > 0, story: data };
}

export async function hasQuiz(email: string) {
  const userId = await getUserId(email);
  if (!userId) return false;
  const { count, error } = await supabase.from('quiz_answers').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function hasStory(email: string) {
  const userId = await getUserId(email);
  if (!userId) return false;
  const { count, error } = await supabase.from('stories').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function hasEarlyAccess(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('early_access_applied')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return Boolean(data?.early_access_applied);
}

export async function joinEarlyAccess(email: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ early_access_applied: true, early_access_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())
    .select()
    .maybeSingle();
  if (error) throw error;
  return { already: data?.early_access_applied, user: data };
}

export async function userSummary(email: string) {
  const userId = await getUserId(email);
  if (!userId) return { found: false, quizCount: 0, storyCount: 0 };
  const [quizRes, storyRes] = await Promise.all([
    supabase.from('quiz_answers').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('stories').select('id', { count: 'exact', head: true }).eq('user_id', userId)
  ]);
  if (quizRes.error) throw quizRes.error;
  if (storyRes.error) throw storyRes.error;
  return { found: true, quizCount: quizRes.count ?? 0, storyCount: storyRes.count ?? 0 };
}
