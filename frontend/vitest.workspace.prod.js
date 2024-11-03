import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      extends: 'vite.config.js',
      include: [
        'tests/unit/*.{test,spec}.js',
      ],
      name: 'unit',
      environment: 'node',
    },
  },
  {
    extends: 'vite.config.js',
    test: {
      name: 'browser',
      include: [
        'tests/browser/*.{test,spec}.js',
      ],
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true,
      },
    },
  },
])
