import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'npx next dev -p 3100',
    url: 'http://localhost:3100/n/unknown',
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
