import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3000', browserName: 'chromium' },
  webServer: [
    {
      command: 'npm run dev:backend',
      url: 'http://127.0.0.1:3001/animales',
      env: { DB_FILE: resolve('backend/db.e2e.json') },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev:frontend',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
