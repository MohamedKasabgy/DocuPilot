import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    launchOptions: {
      slowMo: 800,
    },
    viewport: { width: 1440, height: 900 },
    video: 'on',
    screenshot: 'on',
  },
  reporter: [['list']],
  workers: 1,
});
