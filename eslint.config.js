const js = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Global variables for Node.js
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'writable',
        console: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
      noInlineConfig: false,
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
    ignores: ['node_modules/**', '.env', '*.env'],
  },
];
