import { test, expect } from '@playwright/test';
import fs from 'fs';

const outDir = '../../docs/screenshots';

async function ensureDir() {
  try { fs.mkdirSync(outDir, { recursive: true }); } catch {}
}

test('capture key pages', async ({ page, baseURL }) => {
  await ensureDir();
  await page.goto(`${baseURL}/login`);
  await page.screenshot({ path: `${outDir}/login.png`, fullPage: true });

  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard');
  await page.screenshot({ path: `${outDir}/dashboard.png`, fullPage: true });

  await page.goto(`${baseURL}/leads`);
  await page.screenshot({ path: `${outDir}/leads.png`, fullPage: true });

  const firstLead = page.locator('table tbody tr').first();
  await firstLead.getByRole('link').click();
  await page.screenshot({ path: `${outDir}/lead-detail.png`, fullPage: true });

  await page.goto(`${baseURL}/deals`);
  await page.screenshot({ path: `${outDir}/deals.png`, fullPage: true });

  await page.goto(`${baseURL}/companies`);
  await page.screenshot({ path: `${outDir}/companies.png`, fullPage: true });
});
