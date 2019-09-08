module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    es6: true
  },
  rules: {
    'space-before-function-paren': ['error', 'never'],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'brace-style': ['error', '1tbs'],
    indent: ['error', 2],
    curly: ['error', 'all'],
    'keyword-spacing': [
      'error',
      { overrides: { if: { after: false }, for: { after: false }, while: { after: false } } }
    ],
    'space-before-blocks': ['error', 'always'],
    'no-inner-declarations': 'off'
  }
}
