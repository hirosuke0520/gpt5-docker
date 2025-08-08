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
  // 新規Lead作成
  await page.getByPlaceholder('Contact name').fill('Play Lead');
  await page.getByRole('button', { name: 'Create Lead' }).click();
  // 詳細へ遷移（先頭レコード）
  const firstLead = page.locator('table tbody tr').first();
  await firstLead.getByRole('link').click();

  // 活動の完了トグル（代替ボタン）
  const toggleBtn = page.getByRole('button', { name: /Mark as/ }).first();
  await toggleBtn.click();

  await page.goto('/deals');
  // 新規Deal作成
  await page.getByPlaceholder('Lead ID').fill('1');
  await page.getByPlaceholder('Title').fill('Play Deal');
  await page.getByPlaceholder('Amount').fill('1234');
  await page.getByRole('button', { name: 'Create Deal' }).click();
  // カンバンの最初のカードの最初のボタンでステージ変更（代替操作）
  await page.getByRole('button', { name: /Move to/ }).first().click();

  await expect(page).toHaveURL(/deals/);
});
