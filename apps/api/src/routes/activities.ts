import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = new Hono();

const createSchema = z.object({
  leadId: z.number().int(),
  type: z.enum(['note', 'task', 'call', 'email']),
  content: z.string().min(1),
  dueDate: z.string().date().optional().or(z.literal('').transform(() => undefined)),
  completed: z.boolean().optional()
});

const updateSchema = createSchema.partial();

router.get('/', async (c) => {
  const page = Number(c.req.query('page') || '1');
  const pageSize = Number(c.req.query('pageSize') || '20');
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.activity.findMany({ skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.activity.count()
  ]);
  return c.json({ items, page, pageSize, total });
});

router.post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const created = await prisma.activity.create({ data: { ...parsed.data, completed: parsed.data.completed ?? false } });
  return c.json(created, 201);
});

router.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) return c.json({ error: { code: 'NOT_FOUND', message: 'Activity not found' } }, 404);
  return c.json(activity);
});

router.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const updated = await prisma.activity.update({ where: { id }, data: parsed.data });
  return c.json(updated);
});

router.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.activity.delete({ where: { id } });
  return c.body(null, 204);
});

export default router;
