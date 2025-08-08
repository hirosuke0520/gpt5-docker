import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = new Hono();

const dateString = z
  .string()
  .refine((v) => !v || !Number.isNaN(Date.parse(v)), 'Invalid date');

const createSchema = z.object({
  leadId: z.number().int(),
  title: z.string().min(1),
  amount: z.number(),
  stage: z.enum(['prospecting', 'proposal', 'negotiation', 'won', 'lost']),
  expectedCloseDate: dateString.optional().transform((v) => (v ? new Date(v) : undefined))
});

const updateSchema = createSchema.partial();

router.get('/', async (c) => {
  const page = Number(c.req.query('page') || '1');
  const pageSize = Number(c.req.query('pageSize') || '20');
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.deal.findMany({ skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.deal.count()
  ]);
  return c.json({ items, page, pageSize, total });
});

router.post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const created = await prisma.deal.create({ data: parsed.data as any });
  return c.json(created, 201);
});

router.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) return c.json({ error: { code: 'NOT_FOUND', message: 'Deal not found' } }, 404);
  return c.json(deal);
});

router.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const updated = await prisma.deal.update({ where: { id }, data: parsed.data as any });
  return c.json(updated);
});

router.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.deal.delete({ where: { id } });
  return c.body(null, 204);
});

export default router;
