import React from 'react';

import { BaseCommand } from '~component/cmdk/extension/command/base';
import { Topic } from '~component/cmdk/topic/topic';

type CommandPanelProps = {
  children: React.ReactNode;
  title?: string;
  keywords?: string[];
  icon?: React.ReactNode;
  topics?: Topic[];
};

const CommandPanel: React.FC<CommandPanelProps> = ({ children, title, icon, topics, keywords }) => {
  const enhanceChild = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement<BaseCommand>(child)) {
      return child;
    }

    const { extension = title, icon: childIcon = icon, name: childName, keywords: childKeywords = [] } = child.props;

    const mergedKeywords = [
      ...new Set([title, ...(keywords || []), ...childKeywords, ...(topics?.map((topic) => topic.keyword) || [])])
    ];

    const newProps = {
      ...child.props,
      extension,
      icon: childIcon,
      name: childName ? `${title}-${childName}` : childName,
      keywords: mergedKeywords
    };

    return React.cloneElement(child, newProps);
  };

  const enhancedChildren = React.Children.map(children, enhanceChild);

  return <>{enhancedChildren}</>;
};

export const MotionPack = CommandPanel;
export { CommandPanel };
