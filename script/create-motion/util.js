// util.js
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const toCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const toKebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

module.exports = {
  toCamelCase,
  toKebabCase
};
