import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export function setTestEnv() {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'mysql://crm:crm@127.0.0.1:3306/crm';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'please-change-me';
  process.env.CSRF_ALLOWED_ORIGIN = process.env.CSRF_ALLOWED_ORIGIN || 'http://localhost:3000';
}

export async function ensureAdminUser() {
  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', passwordHash, role: 'admin' as any }
  });
  await prisma.$disconnect();
}
