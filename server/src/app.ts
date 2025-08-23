import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

export const prisma = new PrismaClient();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.get('/', (_req: Request, res: Response) => {
  res.type('text/plain').send('Trawell API running');
});

const userSchema = z.object({ name: z.string().min(1), email: z.string().email(), phone: z.string().optional() });
const quizAnswerSchema = z.object({ questionId: z.number().int().nonnegative(), selectedOptions: z.array(z.string()) });
const storySchema = z.object({ text: z.string().min(5) });
type QuizAnswer = z.infer<typeof quizAnswerSchema>;

app.post('/api/users', async (req: Request, res: Response) => {
  const parsed = userSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, phone } = parsed.data; const email = parsed.data.email.toLowerCase();
  try { const user = await prisma.user.upsert({ where: { email }, update: { name, phone }, create: { name, email, phone } }); res.json(user); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to upsert user' }); }
});

app.post('/api/users/:email/quiz', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); const answers = z.array(quizAnswerSchema).safeParse(req.body); if (!answers.success) return res.status(400).json({ error: answers.error.flatten() }); try { const user = await prisma.user.findUnique({ where: { email } }); if (!user) return res.status(404).json({ error: 'User not found' }); await prisma.quizAnswer.deleteMany({ where: { userId: user.id } }); const toInsert = (answers.data as QuizAnswer[]).map(a => ({ userId: user.id, questionId: a.questionId, selectedOptions: JSON.stringify(a.selectedOptions) })); await prisma.quizAnswer.createMany({ data: toInsert }); res.json({ ok: true }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to save quiz answers' }); } });

app.get('/api/users/:email/quiz/exists', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); try { const user = await prisma.user.findUnique({ where: { email }, select: { id: true } }); if (!user) return res.json({ exists: false }); const count = await prisma.quizAnswer.count({ where: { userId: user.id } }); res.json({ exists: count > 0 }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to check quiz answers' }); } });

app.post('/api/users/:email/story', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); const parse = storySchema.safeParse(req.body); if (!parse.success) return res.status(400).json({ error: parse.error.flatten() }); try { const user = await prisma.user.findUnique({ where: { email } }); if (!user) return res.status(404).json({ error: 'User not found' }); const existing = await prisma.story.findFirst({ where: { userId: user.id } }); const story = existing ? await prisma.story.update({ where: { id: existing.id }, data: { text: parse.data.text } }) : await prisma.story.create({ data: { userId: user.id, text: parse.data.text } }); res.json({ replaced: Boolean(existing), story }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to save story' }); } });

app.get('/api/users/:email/story/exists', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); try { const user = await prisma.user.findUnique({ where: { email }, select: { id: true } }); if (!user) return res.json({ exists: false }); const count = await prisma.story.count({ where: { userId: user.id } }); res.json({ exists: count > 0 }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to check story' }); } });

app.get('/api/users/:email/early-access/exists', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); try { const user = await prisma.user.findUnique({ where: { email }, select: { earlyAccessApplied: true } }); res.json({ exists: Boolean(user?.earlyAccessApplied) }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to check early access' }); } });
app.post('/api/users/:email/early-access', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); try { const user = await prisma.user.findUnique({ where: { email } }); if (!user) return res.status(404).json({ error: 'User not found' }); if (user.earlyAccessApplied) return res.json({ already: true, user }); const updated = await prisma.user.update({ where: { email }, data: { earlyAccessApplied: true, earlyAccessAt: new Date() } }); res.json({ already: false, user: updated }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to mark early access' }); } });

app.get('/api/users/:email/summary', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); try { const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } }); if (!user) return res.json({ found: false, quizCount: 0, storyCount: 0 }); const [quizCount, storyCount] = await Promise.all([ prisma.quizAnswer.count({ where: { userId: user.id } }), prisma.story.count({ where: { userId: user.id } }) ]); res.json({ found: true, quizCount, storyCount }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to get summary' }); } });
app.get('/api/users/:email', async (req: Request, res: Response) => { const email = req.params.email.toLowerCase(); try { const user = await prisma.user.findUnique({ where: { email } }); if (!user) return res.status(404).json({ error: 'Not found' }); const [quizCount, storyCount] = await Promise.all([ prisma.quizAnswer.count({ where: { userId: user.id } }), prisma.story.count({ where: { userId: user.id } }) ]); res.json({ user, quizCount, storyCount }); } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch user' }); } });

export default app;