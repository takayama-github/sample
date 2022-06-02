module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        "airbnb-base",
        "eslint-config-prettier"
    ],
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        "no-console": "off",
        "no-plusplus": "off",
        "no-use-before-define": "off",
        "no-await-in-loop": "off",
        "no-else-return": "off",
        "no-irregular-whitespace": "off",
        "class-methods-use-this": "off"
    },
};