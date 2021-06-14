module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.eslint.json",
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  ignorePatterns: ["node_modules/", "build/", "dist/", "e2e/"],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    "@typescript-eslint/space-infix-ops": "off",
    "@typescript-eslint/object-curly-spacing": "off",
  },
};
