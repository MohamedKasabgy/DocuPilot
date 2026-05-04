import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test('Header notification dropdown opens and marks all read', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  // Bell button
  const bell = page.locator('button[aria-label="Notifications"]');
  await bell.click();
  await expect(page.getByText('Mark all read')).toBeVisible();

  await page.getByText('Mark all read').click();
  await expect(page.getByText('All notifications marked as read')).toBeVisible();
});

test('Header avatar menu opens and shows demo items', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  await page.locator('button[aria-label="User menu"]').click();
  await expect(page.getByText('admin@docupilot.io')).toBeVisible();
  await expect(page.getByRole('button', { name: /Profile/i })).toBeVisible();
});

test('Header search shows results and navigates', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');

  const searchInput = page.locator('input[placeholder="Search projects, contracts, tasks..."]');
  await searchInput.fill('contract');

  await expect(page.getByRole('button', { name: /^Contracts/ }).first()).toBeVisible();
  await page.getByRole('button', { name: /^Contracts/ }).first().click();

  await expect(page).toHaveURL(/\/contracts/);
});

test('Projects page tabs switch content', async ({ page }) => {
  await page.goto(`${BASE}/projects`);
  await page.waitForLoadState('networkidle');

  // Default Overview tab visible
  await expect(page.getByText('Project Roadmap')).toBeVisible();

  // Switch to SRS tab
  await page.getByRole('button', { name: 'SRS' }).first().click();
  await expect(page.getByText('SRS Document')).toBeVisible();

  // Switch to Tasks tab
  await page.getByRole('button', { name: 'Tasks' }).first().click();
  await expect(page.getByRole('heading', { name: 'All Tasks' })).toBeVisible();
});

test('Sidebar New Project navigates to SRS Generator', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.locator('aside .btn-new-project').click();
  await expect(page).toHaveURL(/\/srs-generator/);
});
