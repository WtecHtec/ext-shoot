import React from 'react';

import { BaseCommand } from '~component/cmdk/extension/command/base';
import { Topic } from '~component/cmdk/topic/topic';

type CommandPanelProps = {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  topics?: Topic[];
};
// CommandPanel 组件
const CommandPanel: React.FC<CommandPanelProps> = ({ children, title, icon, topics }) => {
  const enhanceChild = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement<BaseCommand>(child)) {
      return child;
    }

    const { props: childProps } = child;
    const { extension = title, icon: childIcon = icon, name: childName, keywords: childKeywords } = childProps;

    const newProps = {
      ...childProps,
      extension,
      icon: childIcon,
      name: childName ? `${title}-${childName}` : childName,
      keywords: childKeywords?.map((keyword) => `${title}-${keyword}`) || []
    };

    if (topics) {
      const topicKeywords = topics.map((topic) => topic.keyword);
      newProps.keywords = [...new Set([...newProps.keywords, ...topicKeywords])]; // Merge and remove duplicates
    }

    return React.cloneElement(child as React.ReactElement<BaseCommand>, newProps);
  };

  const enhancedChildren = React.Children.map(children, enhanceChild);

  return <>{enhancedChildren}</>;
};
export { CommandPanel };
