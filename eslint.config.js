import js from '@eslint/js';
import globals from 'globals';

// Configuração base do ESLint para todo o projeto.
// Mantém as regras recomendadas, adiciona padrões mais rígidos e libera console apenas no servidor local.
export default [
  {
    // Arquivos e pastas gerados ou externos que não devem ser analisados.
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    // Regras aplicadas ao código JavaScript do projeto.
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Exceção controlada para o servidor de desenvolvimento, que precisa usar console.log.
    files: ['scripts/serve.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
];
