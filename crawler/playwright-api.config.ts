import { defineConfig } from '@playwright/test';

/**
 * Playwright Konfiguration nur für API-Tests (ohne Browser)
 */
export default defineConfig({
  testDir: './tests',
  timeout: 5 * 60 * 1000, // 5 Minuten für API-Tests
  
  // Kein Browser nötig für API-Tests
  projects: [
    {
      name: 'api-tests',
      // Keine Browser-Konfiguration - nur Node.js APIs
      use: {},
    },
  ],
  
  // Test-Matching nur für chatgpt Tests
  testMatch: /.*chatgpt.*\.spec\.ts/,
  
  // Reporter für API-Tests
  reporter: [
    ['html'],
    ['list']
  ],
  
  // Globals für API-Tests
  use: {
    // Kein baseURL oder andere Browser-spezifische Einstellungen
  },
});