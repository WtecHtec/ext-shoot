import React from 'react';
import TestRenderer from 'react-test-renderer';

import CustomReconciler from './reconciler';

// 序列化和反序列化函数
export const serialize = (reactElement: React.ReactElement) => {
  return new Promise((resolve) => {
    const container = { children: [] };
    const root = CustomReconciler.createContainer(container, false, false);
    CustomReconciler.updateContainer(reactElement, root, null, () => {
      console.log('Container updated');
      resolve(container.children);
    });
  });
};

// 序列化函数，使用 react-test-renderer 来渲染 React 元素
export const serialize2 = (reactElement: React.ReactElement) => {
  return new Promise((resolve) => {
    // 使用 TestRenderer 创建一个 React 元素的实例
    const testRenderer = TestRenderer.create(reactElement);
    // 使用 toJSON 方法将渲染的输出转换为 JSON 对象
    const json = testRenderer.toJSON();
    // 使用 TestRenderer 的 unmount 方法来清理内存
    testRenderer.unmount();
    // 解析 Promise，返回 JSON 表示的组件
    resolve(json);
  });
};

export const deserialize = (serialized: any[]): React.ReactElement[] => {
  return serialized.map((node) => {
    if (node.type === 'text') {
      return node.text;
    } else {
      const children = node.children ? deserialize(node.children) : [];
      return React.createElement(node.type, node.props, ...children);
    }
  });
};
