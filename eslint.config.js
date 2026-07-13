import js from "@eslint/js";
import node from "eslint-plugin-n";
import mocha from "eslint-plugin-mocha";
import imprt from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";
import { configs as typescript } from "typescript-eslint";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs"; // eslint-disable-line import/default
import prettier from "eslint-plugin-prettier/recommended";

const testFiles = ["test/{,**/}*.js"];

export default [
  js.configs.recommended,
  node.configs["flat/recommended-script"],
  comments.recommended, // eslint-disable-line import/no-named-as-default-member
  unicorn.configs.recommended,
  imprt.flatConfigs.recommended,
  ...typescript.recommended,
  prettier,
  {
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
    rules: {
      "unicorn/prevent-abbreviations": 0,
      "unicorn/no-null": 0,
      "unicorn/no-array-for-each": 0,
      "unicorn/import-style": 0,
      "unicorn/catch-error-name": ["error", { name: "e" }],
      "@eslint-community/eslint-comments/no-unused-disable": "error",
    },
  },
  {
    ...mocha.configs.recommended,
    files: testFiles,
  },
  {
    files: testFiles,
    rules: {
      "mocha/no-mocha-arrows": "off",
    },
  },
  {
    ignores: ["coverage/", "node_modules/"],
  },
  {
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
];
