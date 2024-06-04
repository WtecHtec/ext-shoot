// index.js

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

// index.js

const createPackage = require('./create-package');
const injectComponent = require('./import-package');
const { toCamelCase, toKebabCase } = require('./util');

const createAndInject = (motionPackName, motionName = 'test') => {
  const kebabCaseMotionPackName = toKebabCase(motionPackName);
  const camelCaseMotionPackName = toCamelCase(motionPackName);

  createPackage(motionPackName, motionName, kebabCaseMotionPackName, camelCaseMotionPackName);
  injectComponent(kebabCaseMotionPackName, camelCaseMotionPackName);
};

module.exports = {
  createPackage,
  injectComponent,
  createAndInject
};

// 如果从命令行直接运行
if (require.main === module) {
  const [motionPackName, motionName = 'test'] = process.argv.slice(2);

  // 输入参数有效性检查
  if (!motionPackName) {
    console.error('Usage: node script/create-motion/index.js <motionPackName> [motionName]');
    process.exit(1);
  }

  createAndInject(motionPackName, motionName);
}
