// minimal declaration to avoid needing @types/node immediately
declare const process: any;
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

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

// Create or get user by email
app.post('/api/users', async (req: Request, res: Response) => {
  const parse = userSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { name, email, phone } = parse.data;
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, phone },
      create: { name, email, phone },
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to upsert user' });
  }
});

// Save quiz answers for a user
app.post('/api/users/:email/quiz', async (req: Request, res: Response) => {
  const email = req.params.email;
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
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save quiz answers' });
  }
});

// Check if quiz answers exist for a user
app.get('/api/users/:email/quiz/exists', async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return res.json({ exists: false });
    const count = await prisma.quizAnswer.count({ where: { userId: user.id } });
    res.json({ exists: count > 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to check quiz answers' });
  }
});

// Save story for a user
app.post('/api/users/:email/story', async (req: Request, res: Response) => {
  const email = req.params.email;
  const parse = storySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const story = await prisma.story.create({
      data: { userId: user.id, text: parse.data.text },
    });
    res.json(story);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save story' });
  }
});

// Check if story exists
app.get('/api/users/:email/story/exists', async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return res.json({ exists: false });
    const count = await prisma.story.count({ where: { userId: user.id } });
    res.json({ exists: count > 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to check story status' });
  }
});

// Mark early access applied
app.post('/api/users/:email/early-access', async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { earlyAccessApplied: true, earlyAccessAt: new Date() },
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to mark early access' });
  }
});

// Check early access status
app.get('/api/users/:email/early-access', async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { earlyAccessApplied: true, earlyAccessAt: true } });
    res.json(user ?? { earlyAccessApplied: false, earlyAccessAt: null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch early access status' });
  }
});
const port = Number(process.env.PORT) || 5174;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
