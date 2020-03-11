module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier', 'jest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {},
};
