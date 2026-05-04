import { test, expect } from '@playwright/test';

test.describe('DocuPilot — Mobile Visual Walkthrough', () => {

  test('Full mobile experience on iPhone 14', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // 1. Dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    // Scroll through dashboard
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // 2. Open hamburger menu
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await page.waitForTimeout(600);

    // 3. Navigate to SRS Generator
    await page.locator('.sidebar a').filter({ hasText: /SRS Generator/i }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/srs-generator/);
    await page.waitForTimeout(500);

    // Scroll through SRS options
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(400);

    // Fill in a request
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible()) {
      await textarea.click();
      await textarea.clear();
      await textarea.type('نحتاج نظام حجوزات للعيادات', { delay: 40 });
      await page.waitForTimeout(500);
    }

    // 4. Navigate to Contracts via hamburger
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Contracts/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Scroll to see upload zone stacking
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(600);

    // 5. Navigate to Invoices
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Invoices/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Scroll through invoice
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    // 6. Navigate to Projects
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Projects/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    // 7. Scope Guard
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Scope Guard/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(600);

    // 8. Risk Radar
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Risk Radar/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Click filters
    const highBtn = page.locator('button').filter({ hasText: /^High$/i }).first();
    if (await highBtn.isVisible()) {
      await highBtn.click();
      await page.waitForTimeout(400);
    }
    const allBtn = page.locator('button').filter({ hasText: /^All$/i }).first();
    if (await allBtn.isVisible()) {
      await allBtn.click();
      await page.waitForTimeout(400);
    }

    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    // 9. Ask DocuPilot
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Ask DocuPilot/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const chatInput = page.locator('input[type="text"], textarea').last();
    if (await chatInput.isVisible()) {
      await chatInput.click();
      await chatInput.type('What are the open risks?', { delay: 35 });
      await page.waitForTimeout(600);
    }

    // 10. Back to Dashboard
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Dashboard/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
  });

  test('Galaxy S21 (360px) quick walkthrough', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Scroll
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));

    // Open menu and navigate
    await page.locator('.mobile-menu-btn').click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /SRS Generator/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(400);

    // Navigate to invoices
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('.mobile-menu-btn').click();
    await page.waitForTimeout(400);
    await page.locator('.sidebar a').filter({ hasText: /Invoices/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
  });
});
