import { defineConfig } from 'vitest/config';

/**
 * vitest.config.js
 * Configuração do Vitest para executar testes ESM
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
