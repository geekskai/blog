module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "next",
    "next/core-web-vitals",
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "react/no-unescaped-entities": 0,
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
}
