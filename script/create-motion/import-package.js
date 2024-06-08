// import-package.js

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const injectComponent = (motionPackName, camelCaseMotionPackName) => {
  const filePath = path.join(__dirname, '../../src/component/cmdk/motion/motion-ui.tsx');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const ast = parser.parse(fileContent, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });

  const ComponentName = camelCaseMotionPackName.charAt(0).toUpperCase() + camelCaseMotionPackName.slice(1);
  let importExists = false; // 标志，检查导入是否存在

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === `~extension/${motionPackName}`) {
        importExists = true; // 发现已存在导入
        path.stop(); // 停止遍历
      }
    }
  });

  if (!importExists) {
    // 如果不存在导入，则添加导入
    traverse(ast, {
      ImportDeclaration(path) {
        if (path.node.source.value.startsWith('~extension/')) {
          path.insertBefore(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(ComponentName))],
              t.stringLiteral(`~extension/${motionPackName}`)
            )
          );
          path.stop(); // 添加完导入后停止遍历
        }
      }
    });
  }

  traverse(ast, {
    JSXElement(path) {
      let elementName;
      if (path.node.openingElement.name.type === 'JSXIdentifier') {
        elementName = path.node.openingElement.name.name;
      } else if (path.node.openingElement.name.type === 'JSXMemberExpression') {
        elementName = path.node.openingElement.name.property.name;
      }

      if (elementName === 'Group') {
        const attributes = path.node.openingElement.attributes;
        const headingAttribute = attributes.find(
          (attr) => attr.name && attr.name.name === 'heading' && attr.value.expression.value === 'Results'
        );

        if (headingAttribute) {
          console.log("Found the 'Results' Group");

          const newElement = t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier(ComponentName), [], true),
            null,
            [],
            true
          );

          path.node.children.push(
            t.jsxText('  '), // 保持缩进
            newElement,
            t.jsxText('\n')
          );
          console.log('New component inserted.');
          path.stop();
        }
      }
    }
  });

  const newCode = generate(ast, { retainLines: false }).code;
  fs.writeFileSync(filePath, newCode);

  console.log(`${ComponentName} component has been successfully imported and added to command-ui.tsx.`);
};

module.exports = injectComponent;
