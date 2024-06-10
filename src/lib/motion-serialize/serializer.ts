import React from 'react';

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
