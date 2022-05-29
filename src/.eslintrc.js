const { resolve } = require("path");

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:import/typescript",
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: resolve(__dirname),
      },
    },
  },
  rules: {
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/member-ordering": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "no-console": "error",
    "no-alert": "error",
    "require-atomic-updates": "off",
    "standard/no-callback-literal": "off",
    // https://github.com/import-js/eslint-plugin-import/issues/1883
    "import/named": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["src/tests/**"] },
    ],
    "no-param-reassign": ["error", { props: false }],
    camelcase: ["error", { allow: ["^\\$_"] }],
    "no-continue": "off",
    "no-underscore-dangle": ["error", { allow: ["__typename", "__RELEASE__"] }],
    // not good with inheritance
    "class-methods-use-this": "off",
    // disallow certain syntax forms
    // https://eslint.org/docs/rules/no-restricted-syntax
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      // allows ForOfStatement
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],

    // typescript handled rules
    "no-shadow": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "consistent-return": "off",
    "vue/return-in-computed-property": "off",
    "default-param-last": "off",
    "no-bitwise": "off",
    "import/no-import-module-exports": "off",
  },
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["tests/**"],
      rules: { "no-console": "off" },
    },
  ],
};
