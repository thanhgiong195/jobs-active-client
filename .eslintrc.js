module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    "eslint:recommended",
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/recommended",
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // https://eslint.org/docs/user-guide/configuring#configuring-rules
    "semi": [1, "never"],
    "no-console": "off",
    "vue/no-v-html": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/no-side-effects-in-computed-properties": "off",
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/no-async-in-computed-properties": "off",
    "prettier/prettier": ["error", { "semi": false }]
  }
}
