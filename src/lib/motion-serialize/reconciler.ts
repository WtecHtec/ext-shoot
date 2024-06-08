import React from 'react';
import ReactReconciler from 'react-reconciler';

// 用来存储序列化后的组件树结构
let serializedTree: any = {};

// 定义主机配置
const hostConfig = {
  now: Date.now,
  supportsMutation: true,

  createInstance(type: any, props: any) {
    const instance = { type, props };

    // 序列化组件实例
    const serializedInstance = { type, props: { ...props } };
    if (props.handle && typeof props.handle === 'function') {
      serializedInstance.props.handle = 'function'; // 指示这是一个函数
    }

    return { instance, serializedInstance };
  },

  appendInitialChild(parentInstance: any, child: any) {
    parentInstance.instance.children = parentInstance.instance.children || [];
    parentInstance.instance.children.push(child.instance);

    parentInstance.serializedInstance.children = parentInstance.serializedInstance.children || [];
    parentInstance.serializedInstance.children.push(child.serializedInstance);
  },

  appendChildToContainer(container: any, child: any) {
    container.children.push(child);
  },

  prepareUpdate() {
    return true;
  },

  commitUpdate(instance: any, updatePayload: any, type: any, oldProps: any, newProps: any) {
    Object.assign(instance.instance.props, newProps);
    Object.assign(instance.serializedInstance.props, newProps);
  },

  finalizeInitialChildren() {
    return false;
  },

  getPublicInstance(instance: any) {
    return instance.instance;
  },

  prepareForCommit() {
    return null;
  },

  resetAfterCommit() {
    // Commit 结束后
  },

  shouldSetTextContent() {
    return false;
  },

  createTextInstance(text: any) {
    return text;
  },

  clearContainer(container: any) {
    container.children = [];
  }
};

// 创建自定义的 Reconciler 实例
const CustomReconciler = ReactReconciler(hostConfig);

// 渲染函数
const render = (reactElement: React.ReactElement, container: any) => {
  const containerInstance = CustomReconciler.createContainer(container, false, false);
  CustomReconciler.updateContainer(reactElement, containerInstance, null, () => {
    console.log('Rendered');
    serializedTree = containerInstance.current.child.serializedInstance;
  });
};

// 序列化函数
export const serialize = (reactElement: React.ReactElement) => {
  const container = { children: [] };
  render(reactElement, container);
  return serializedTree;
};

// 反序列化函数
export const deserialize = (serializedTree: any): React.ReactElement => {
  const createElementFromSerialized = (node: any): React.ReactElement => {
    const { type, props, children } = node;
    const elementProps = { ...props };

    if (elementProps.handle === 'function') {
      elementProps.handle = () => {}; // 或者你可以提供实际的函数实现
    }

    return React.createElement(type, elementProps, ...(children ? children.map(createElementFromSerialized) : []));
  };

  return createElementFromSerialized(serializedTree);
};
