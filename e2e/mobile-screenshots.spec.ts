import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
];

const ALL_ROUTES = [
  { name: 'dashboard', path: '/' },
  { name: 'projects', path: '/projects' },
  { name: 'contracts', path: '/contracts' },
  { name: 'srs-generator', path: '/srs-generator' },
  { name: 'invoices', path: '/invoices' },
  { name: 'scope-guard', path: '/scope-guard' },
  { name: 'risks', path: '/risks' },
  { name: 'approvals', path: '/approvals' },
  { name: 'ask-docupilot', path: '/ask-docupilot' },
];

for (const viewport of VIEWPORTS) {
  for (const route of ALL_ROUTES) {
    test(`${route.name} @ ${viewport.name}px — no overflow`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const p = await context.newPage();
      await p.goto(`http://localhost:3000${route.path}`);
      await p.waitForLoadState('networkidle');
      await p.waitForTimeout(300);

      const { scrollWidth, clientWidth } = await p.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      const hasOverflow = scrollWidth > clientWidth;

      if (route.name === 'projects' && viewport.name === '430') {
        await p.screenshot({ path: `test-results/mobile-${route.name}-${viewport.name}px.png`, fullPage: true });
      }
      if (route.name === 'projects' && viewport.name === '375') {
        await p.screenshot({ path: `test-results/mobile-${route.name}-${viewport.name}px.png`, fullPage: true });
      }

      if (hasOverflow) {
        console.log(`⚠️  OVERFLOW: ${route.name} @ ${viewport.name}px — scroll=${scrollWidth} client=${clientWidth}`);
      } else {
        console.log(`✅ ${route.name} @ ${viewport.name}px`);
      }

      expect(hasOverflow, `${route.name} overflows at ${viewport.name}px (scroll=${scrollWidth} > client=${clientWidth})`).toBe(false);
      await context.close();
    });
  }
}
