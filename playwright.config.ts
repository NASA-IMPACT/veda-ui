import { defineConfig, devices } from '@playwright/test';

/**
 * E2E Tests for the Dashboard Application (apps/dashboard-parcel)
 */
export default defineConfig({
  testDir: './apps/dashboard-parcel/test/playwright/tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:9000',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    timeout: 6 * 60 * 1000,
    command: 'yarn serve',
    url: 'http://localhost:9000',
    reuseExistingServer: !process.env.CI
  }
});
