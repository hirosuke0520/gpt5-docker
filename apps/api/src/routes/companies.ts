import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = new Hono();

const createSchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional().or(z.literal('').transform(() => undefined)),
  notes: z.string().optional().or(z.literal('').transform(() => undefined))
});

const updateSchema = createSchema.partial();

router.get('/', async (c) => {
  const page = Number(c.req.query('page') || '1');
  const pageSize = Number(c.req.query('pageSize') || '20');
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.company.findMany({ skip, take: pageSize, orderBy: { id: 'desc' } }),
    prisma.company.count()
  ]);
  return c.json({ items, page, pageSize, total });
});

router.post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const created = await prisma.company.create({ data: parsed.data });
  return c.json(created, 201);
});

router.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) return c.json({ error: { code: 'NOT_FOUND', message: 'Company not found' } }, 404);
  return c.json(company);
});

router.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const updated = await prisma.company.update({ where: { id }, data: parsed.data });
  return c.json(updated);
});

router.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.company.delete({ where: { id } });
  return c.body(null, 204);
});

export default router;
