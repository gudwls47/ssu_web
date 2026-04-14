import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "build/**",
      "client/**",
      "public/**",
      "scripts/**",
      "**/client/*.js",
      "**/*.json",
      "**/@swagger/**",
      "**/*.svg",
      "**/*.jpg",
      "**/*.png",
      ".eslintcache",
      "**/@types/tui/**",
      "static/**",
      ".eslintrc.js",
      "eslint.config.js",
      "next-env.d.ts",
      "public/smarteditor2/**",
    ],
  },
  // Base configuration
  js.configs.recommended,
  // TypeScript ESLint configuration
  ...tseslint.configs.recommended,
  // Convert legacy configs to flat config (airbnb and other compatible configs)
  ...compat.extends(
    "airbnb",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ),
  // Global configuration
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      "mdx/code-blocks": true,
      "mdx/language-mapper": {},
      react: {
        version: "detect",
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"],
      },
      "import/resolver": {
        typescript: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
      "import/extensions": [".js", ".ts", ".mjs", ".jsx", ".tsx", ".json"],
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "warn",
      // eslint-import-plugin
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "object",
            "type",
            "unknown",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "next/*",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "**/*.svg",
              group: "unknown",
              position: "before",
            },
            {
              pattern: "@emotion/*",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: [],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-named-as-default": 0,
      "import/no-unresolved": "error",
      "import/no-extraneous-dependencies": [
        "off",
        {
          devDependencies: true,
          optionalDependencies: true,
          peerDependencies: true,
        },
      ],
      "import/no-cycle": "off",
      "import/prefer-default-export": "off",
      "import/no-deprecated": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
          json: "always",
        },
      ],
      "import/no-duplicates": "off",
      // eslint
      camelcase: "off",
      "class-methods-use-this": "off",
      "consistent-return": "off",
      curly: ["error", "all"],
      "default-case": "off",
      "prefer-template": "off",
      "lines-between-class-members": [
        "error",
        "always",
        {
          exceptAfterSingleLine: true,
        },
      ],
      "no-shadow": "off",
      "no-alert": "off",
      "no-await-in-loop": "off",
      "no-control-regex": "off",
      "no-duplicate-imports": "error",
      "no-else-return": "off",
      "no-param-reassign": "off",
      "no-prototype-builtins": "off",
      "no-restricted-syntax": ["error", "ForInStatement", "WithStatement"],
      "no-return-assign": "off",
      "no-return-await": "off",
      "no-undefined": "error",
      "no-underscore-dangle": "off",
      "no-use-before-define": "off",
      "no-void": "off",
      "no-unused-vars": "off",
      "prefer-destructuring": [
        "error",
        {
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
      "max-classes-per-file": "off",
      // @typescript-eslint
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/no-else-return": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/prefer-interface": "off",
      "@typescript-eslint/no-inferrable-types": [
        "warn",
        {
          ignoreParameters: true,
        },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/ban-types": "off",

      //
      "react/no-unstable-nested-components": "off",
      "react/jsx-no-comment-textnodes": "off",
      "react/button-has-type": "off",
      "react/destructuring-assignment": "off",
      "react/jsx-boolean-value": "off",
      "react/jsx-filename-extension": [
        "error",
        {
          extensions: [".tsx"],
        },
      ],
      "react/require-default-props": "off",
      "react/jsx-no-bind": "off",
      "react/no-array-index-key": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unused-state": "warn",
      "react/sort-comp": "off",
      "react/jsx-props-no-spreading": "off",
      "react/static-property-placement": "off",
      "react/state-in-constructor": ["error", "never"],
      "react/no-unused-prop-types": "off",
      "react/jsx-no-duplicate-props": "off",

      // jsx-a11y
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/label-has-for": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-noninteractive-tabindex": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/anchor-is-valid": [
        "warn",
        {
          components: ["Link"],
          specialLink: ["route"],
          aspects: ["noHref", "preferButton"],
        },
      ],
      "no-useless-escape": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-danger": "warn",
      "react/no-unknown-property": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@next/next/no-img-element": "off",
      "no-async-promise-executor": "off",
      "no-plusplus": "off",
      "dot-notation": "off",
      "no-nested-ternary": "off",
      "no-unneeded-ternary": "off",
    },
  },
  // TypeScript/TSX specific rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "react/prop-types": "off",
    },
  },
  // Prettier config (should be last)
  prettier,
);
