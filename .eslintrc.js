module.exports = {
  extends: ["plugin:@docusaurus/recommended", "plugin:prettier/recommended"],
  rules: {
    "@docusaurus/no-untranslated-text": ["warn", { ignoredStrings: ["·", "—", "×"] }],
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
};
