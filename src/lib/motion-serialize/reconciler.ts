import ReactReconciler from 'react-reconciler';

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return {};
  },
  getChildHostContext: () => {
    return {};
  },
  prepareForCommit: () => {
    return null;
  },
  resetAfterCommit: () => {
    return null;
  },
  createInstance: (type, props) => {
    const instance = { type, props, children: [] };
    return instance;
  },
  appendInitialChild: (parent, child) => {
    parent.children.push(child);
  },
  finalizeInitialChildren: () => {
    return false;
  },
  prepareUpdate: () => {
    return true;
  },
  commitUpdate: (instance, updatePayload, type, oldProps, newProps) => {
    instance.props = newProps;
  },
  shouldSetTextContent: () => {
    return false;
  },
  createTextInstance: (text) => {
    return { text, type: 'text' };
  },
  appendChildToContainer: (container, child) => {
    container.children.push(child);
  },
  supportsMutation: true,
  clearContainer: (container) => {
    container.children = [];
  },
  appendChild: (parentInstance, child) => {
    parentInstance.children.push(child);
  },
  removeChild: (parentInstance, child) => {
    const index = parentInstance.children.indexOf(child);
    if (index > -1) {
      parentInstance.children.splice(index, 1);
    }
  },
  insertBefore: (parentInstance, child, beforeChild) => {
    const index = parentInstance.children.indexOf(beforeChild);
    if (index > -1) {
      parentInstance.children.splice(index, 0, child);
    } else {
      parentInstance.children.push(child);
    }
  },
  getPublicInstance: (instance) => {
    return instance;
  },
  removeChildFromContainer: (container, child) => {
    const index = container.children.indexOf(child);
    if (index > -1) {
      container.children.splice(index, 1);
    }
  },
  detachDeletedInstance: () => {
    // 用于处理删除实例后的清理工作
  }
};

const CustomReconciler = ReactReconciler(hostConfig);
export default CustomReconciler;
