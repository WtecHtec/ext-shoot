import ReactReconciler from 'react-reconciler';

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => ({}),
  getChildHostContext: () => ({}),
  prepareForCommit: () => null,
  resetAfterCommit: () => null,
  createInstance: (type: any, props: any) => {
    const instance = { type, props, children: [] };
    return instance;
  },
  appendInitialChild: (parent: any, child: any) => {
    parent.children.push(child);
  },
  finalizeInitialChildren: () => false,
  prepareUpdate: () => true,
  commitUpdate: (instance: any, updatePayload: any, type: any, oldProps: any, newProps: any) => {
    instance.props = newProps;
  },
  shouldSetTextContent: () => false,
  createTextInstance: (text: string) => {
    return { text, type: 'text' };
  },
  appendChildToContainer: (container: any, child: any) => {
    container.children.push(child);
  },
  supportsMutation: true,
  clearContainer: (container: any) => {
    container.children = [];
  },
  appendChild: (parentInstance: any, child: any) => {
    parentInstance.children.push(child);
  },
  removeChild: (parentInstance: any, child: any) => {
    const index = parentInstance.children.indexOf(child);
    if (index > -1) {
      parentInstance.children.splice(index, 1);
    }
  },
  insertBefore: (parentInstance: any, child: any, beforeChild: any) => {
    const index = parentInstance.children.indexOf(beforeChild);
    if (index > -1) {
      parentInstance.children.splice(index, 0, child);
    } else {
      parentInstance.children.push(child);
    }
  },
  getPublicInstance: (instance: any) => instance,
  removeChildFromContainer: (container: any, child: any) => {
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
