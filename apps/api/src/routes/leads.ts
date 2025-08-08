import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = new Hono();

const createSchema = z.object({
  companyId: z.number().int(),
  contactName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.enum(['web', 'referral', 'event', 'other']),
  status: z.enum(['new', 'qualified', 'lost']),
  score: z.number().int().default(0)
});

const updateSchema = createSchema.partial();

router.get('/', async (c) => {
  const page = Number(c.req.query('page') || '1');
  const pageSize = Number(c.req.query('pageSize') || '20');
  const q = c.req.query('q')?.trim();
  const status = c.req.query('status') as 'new' | 'qualified' | 'lost' | undefined;
  const companyId = c.req.query('companyId') ? Number(c.req.query('companyId')) : undefined;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (q) {
    where.OR = [
      { contactName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } }
    ];
  }
  if (status) where.status = status;
  if (companyId) where.companyId = companyId;

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { company: true }
    }),
    prisma.lead.count({ where })
  ]);
  return c.json({ items, page, pageSize, total });
});

router.post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const created = await prisma.lead.create({ data: parsed.data });
  return c.json(created, 201);
});

router.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      company: true,
      deals: true,
      activities: true
    }
  });
  if (!lead) return c.json({ error: { code: 'NOT_FOUND', message: 'Lead not found' } }, 404);
  return c.json({ lead, deals: lead.deals, activities: lead.activities });
});

router.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.message } }, 400);
  const updated = await prisma.lead.update({ where: { id }, data: parsed.data });
  return c.json(updated);
});

router.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.lead.delete({ where: { id } });
  return c.body(null, 204);
});

export default router;
