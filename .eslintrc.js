module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
  globals: {
    WebResponder: 'writable',
    MongoDB: 'writable',
    MailTransporter: 'writable',
    ErrorCodes: 'writable',
    SuccessCodes: 'writable',
    ResponseTypes: 'writable',
    Cleaner: 'writable',
    Collections: 'writable',
  },
};