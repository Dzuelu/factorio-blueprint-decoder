const defaultLint = require('dzuelu-eslint-config');

defaultLint.rules['node/no-missing-import'] = ["off"];
defaultLint.rules['import/no-extraneous-dependencies'] = ["error", {"devDependencies": ["**/*.test.tsx"]}];

module.exports = defaultLint;
