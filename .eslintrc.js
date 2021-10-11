module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  ignorePatterns: ['**/client/**/*.js'],
  rules: {
    'import/extensions': ['off'],
    'object-curly-newline': ['off'],
    'function-paren-newline': ['off'],
    'implicit-arrow-linebreak': ['off'],
    'operator-linebreak': ['off'],
    camelcase: ['warn'],
  },
};
