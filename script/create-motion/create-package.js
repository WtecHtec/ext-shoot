/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const createPackage = (motionPackName, motionName, kebabCaseMotionPackName, camelCaseMotionPackName) => {
  // 创建目录路径
  const extensionDir = path.join(__dirname, '../../src/extension', kebabCaseMotionPackName);
  if (!fs.existsSync(extensionDir)) {
    try {
      fs.mkdirSync(extensionDir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory ${extensionDir}: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.error(`Directory ${extensionDir} already exists.`);
    process.exit(1);
  }

  // 模板文件列表，包括二进制文件如图标
  const templates = ['handle.ts.template', 'index.tsx.template', 'icon.png'];
  const exampleDir = path.join(__dirname, '../../src/extension/example');

  templates.forEach((template) => {
    const fullTemplatePath = path.join(exampleDir, template);
    const newFilePath = path.join(extensionDir, template.replace('.template', ''));

    try {
      // 检查文件是否为二进制文件
      if (template.endsWith('.png')) {
        // 复制二进制文件
        fs.copyFileSync(fullTemplatePath, newFilePath);
      } else {
        // 读取文本文件内容，并替换占位符
        const templateContent = fs.readFileSync(fullTemplatePath, 'utf8');
        const content = templateContent
          .replace(/__MOTION_PACK_NAME__/g, camelCaseMotionPackName)
          .replace(/__MOTION_NAME__/g, motionName);
        fs.writeFileSync(newFilePath, content);
      }
    } catch (error) {
      console.error(`Failed to process template ${template}: ${error.message}`);
      process.exit(1);
    }
  });

  console.log(`MotionPackage-${kebabCaseMotionPackName} created successfully.`);
  console.log(`Modify the files in ${extensionDir} to implement your motion.`);
};

module.exports = createPackage;
