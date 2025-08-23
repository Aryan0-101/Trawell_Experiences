// minimal declaration to avoid needing @types/node immediately
declare const process: any;
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

// Helper to send richer error detail during temporary debugging (do NOT keep long-term)
function sendError(res: Response, userMessage: string, err: any) {
  // Always log full error server-side
  console.error(userMessage, err);
  // Expose limited diagnostics; safe codes/meta for PrismaKnownRequestError
  const payload: any = { error: userMessage };
  if (err && typeof err === 'object') {
    if (err.code) payload.code = err.code;
    if (err.meta) payload.meta = err.meta;
    if (process.env.NODE_ENV !== 'production') {
      payload.stack = err.stack;
      payload.message = err.message;
    }
  }
  res.status(500).json(payload);
}

app.use(cors({ origin: true }));
app.use(express.json());

// Health
app.get('/api/health', (_req: Request, res: Response) => res.json({ ok: true }));
// Root info
app.get('/', (_req: Request, res: Response) => {
  res.type('text/plain').send('Trawell API is running. Try GET /api/health');
});

// Schemas
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

const quizAnswerSchema = z.object({
  questionId: z.number().int().nonnegative(),
  selectedOptions: z.array(z.string()),
});
type QuizAnswer = z.infer<typeof quizAnswerSchema>;

const storySchema = z.object({
  text: z.string().min(5),
});
const earlyAccessSchema = z.object({
  email: z.string().email().optional(),
});

// Create or get user by email
app.post('/api/users', async (req: Request, res: Response) => {
  const parse = userSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { name, phone } = parse.data;
  const email = parse.data.email.toLowerCase();
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, phone },
      create: { name, email, phone },
    });
    res.json(user);
  } catch (e: any) {
    sendError(res, 'Failed to upsert user', e);
  }
});

// Save quiz answers for a user
app.post('/api/users/:email/quiz', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  const answers = z.array(quizAnswerSchema).safeParse(req.body);
  if (!answers.success) return res.status(400).json({ error: answers.error.flatten() });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Replace previous answers
    await prisma.quizAnswer.deleteMany({ where: { userId: user.id } });
  const toInsert = (answers.data as QuizAnswer[]).map((a: QuizAnswer) => ({ userId: user.id, questionId: a.questionId, selectedOptions: JSON.stringify(a.selectedOptions) }));
  await prisma.quizAnswer.createMany({ data: toInsert });
    res.json({ ok: true });
  } catch (e: any) {
    sendError(res, 'Failed to save quiz answers', e);
  }
});

// Check if quiz answers exist for a user
app.get('/api/users/:email/quiz/exists', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return res.json({ exists: false });
    const count = await prisma.quizAnswer.count({ where: { userId: user.id } });
    res.json({ exists: count > 0 });
  } catch (e: any) {
    sendError(res, 'Failed to check quiz answers', e);
  }
});

// Save story for a user
app.post('/api/users/:email/story', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  const parse = storySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Only allow one story per user for now. If one exists, replace it.
    const existing = await prisma.story.findFirst({ where: { userId: user.id } });
    let story;
    if (existing) {
      story = await prisma.story.update({ where: { id: existing.id }, data: { text: parse.data.text } });
    } else {
      story = await prisma.story.create({ data: { userId: user.id, text: parse.data.text } });
    }
    res.json({ replaced: Boolean(existing), story });
  } catch (e: any) {
    sendError(res, 'Failed to save story', e);
  }
});

// Story exists check
app.get('/api/users/:email/story/exists', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return res.json({ exists: false });
    const count = await prisma.story.count({ where: { userId: user.id } });
    res.json({ exists: count > 0 });
  } catch (e: any) {
    sendError(res, 'Failed to check story', e);
  }
});

// Early access: explicit flag so just creating a user doesn't count.
app.get('/api/users/:email/early-access/exists', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { earlyAccessApplied: true } });
    res.json({ exists: Boolean(user?.earlyAccessApplied) });
  } catch (e: any) {
    sendError(res, 'Failed to check early access', e);
  }
});

// Mark user as early access (idempotent)
app.post('/api/users/:email/early-access', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.earlyAccessApplied) {
      return res.json({ already: true, user });
    }
    const updated = await prisma.user.update({ where: { email }, data: { earlyAccessApplied: true, earlyAccessAt: new Date() } });
    res.json({ already: false, user: updated });
  } catch (e: any) {
    sendError(res, 'Failed to mark early access', e);
  }
});

// Consolidated summary (quiz/story counts)
app.get('/api/users/:email/summary', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
    if (!user) return res.json({ found: false, quizCount: 0, storyCount: 0 });
    const [quizCount, storyCount] = await Promise.all([
      prisma.quizAnswer.count({ where: { userId: user.id } }),
      prisma.story.count({ where: { userId: user.id } })
    ]);
    res.json({ found: true, quizCount, storyCount });
  } catch (e: any) {
    sendError(res, 'Failed to get summary', e);
  }
});

// Fetch user basic details plus counts
app.get('/api/users/:email', async (req: Request, res: Response) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Not found' });
    const [quizCount, storyCount] = await Promise.all([
      prisma.quizAnswer.count({ where: { userId: user.id } }),
      prisma.story.count({ where: { userId: user.id } })
    ]);
    res.json({ user, quizCount, storyCount });
  } catch (e: any) {
    sendError(res, 'Failed to fetch user', e);
  }
});

// Temporary debug endpoint (remove after diagnosing) to verify DB connectivity & table counts
app.get('/api/debug/status', async (_req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const quizCount = await prisma.quizAnswer.count();
    const storyCount = await prisma.story.count();
    res.json({ ok: true, userCount, quizCount, storyCount, db: process.env.DATABASE_URL ? 'configured' : 'missing env' });
  } catch (e: any) {
    sendError(res, 'Failed debug status', e);
  }
});

const port = Number(process.env.PORT) || 5174;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
