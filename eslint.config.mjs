import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "no-var": "off",
    },
  },
  {
    files: ["tests/runner.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        QUnit: "readonly",
      },
    },
  },
  {
    ignores: ["**/*.min.js"],
  },
];
