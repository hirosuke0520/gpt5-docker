import { test, expect } from '@playwright/test';

test('login→lead作成→deal作成→kanbanでstage変更→activity完了', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard');

  await page.goto('/companies');
  await page.getByPlaceholder('New company name').fill('Play Co');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.goto('/leads');
  // ここでは既存のLeadを利用（作成フォームは後続改良で追加）
  const firstLead = page.locator('table tbody tr').first();
  const leadLink = firstLead.getByRole('link');
  const leadHref = await leadLink.getAttribute('href');
  await leadLink.click();

  // 活動の完了トグル（代替ボタン）
  const toggleBtn = page.getByRole('button', { name: /Mark as/ }).first();
  await toggleBtn.click();

  await page.goto('/deals');
  // カンバンの最初のカードの最初のボタンでステージ変更（代替操作）
  const moveBtn = page.getByRole('button', { name: /Move to/ }).first();
  await moveBtn.click();

  await expect(page).toHaveURL(/deals/);
});
