module.exports = {
  env: {
      browser: true,
      amd: true,
      node: true,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
      'eslint:recommended',
      'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
      'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      'plugin:react-hooks/recommended',
      'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      'plugin:sonarjs/recommended' // Provides the option for SONAR reporting
  ],
  parserOptions: {
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      ecmaFeatures: {
          jsx: true, // Allows for the parsing of JSX
      },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'eslint-plugin-import','sonarjs'],
  rules: {
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
      'sort-imports': [
          'error',
          {
              ignoreCase: false,
              ignoreDeclarationSort: true,
              ignoreMemberSort: false,
              memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
          },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'sonarjs/no-small-switch': 'off',
      'sonarjs/no-duplicate-string': 'off'


  },
  settings: {
      react: {
          version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
      },
  },
};
