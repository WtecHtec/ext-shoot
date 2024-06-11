import React from 'react';

import List from '../extension/List';

const WithItemReplacement: React.FC = ({ children }) => {
  function cloneAndReplace(element: React.ReactNode): React.ReactNode {
    if (!React.isValidElement(element)) {
      return element;
    }

    console.log('Element type:', element.type);

    // 检查 element.type 是否是有效的 React 组件类型
    let type = element.type;
    if (type === List.Item) {
      console.log('Replacing List.Item with List.CMDItem');
      type = List.CMDItem;
    }

    // 递归处理子元素
    const children = React.Children.map(element.props.children, cloneAndReplace);

    return React.cloneElement(element, { ...element.props, type, children });
  }

  const elements = React.Children.map(children, cloneAndReplace);

  return <>{elements}</>;
};

export default WithItemReplacement;
