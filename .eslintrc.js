module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier',
    // Remove 'plugin:prettier/recommended' from here
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // Turn off conflicting ESLint rules
    'prettier/prettier': [
      'error',
      {
        // Add Prettier rules here
        trailingComma: 'all',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        printWidth: 100,
        parser: 'typescript',
        endOfLine: 'auto',
      },
    ],
  },
}
