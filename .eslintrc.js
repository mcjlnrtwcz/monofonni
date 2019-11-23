module.exports = {
  env: {
    browser: true
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
    "import/extensions": "off",
    "no-param-reassign": ["error", { props: false }]
  }
};
