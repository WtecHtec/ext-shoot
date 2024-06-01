import React from 'react';

import { exitPanel } from '../panel';
import { searchManager } from '../search/search-manager';
import { Topic } from '../topic/topic';
import { Action } from './Action';
import { ActionPanel } from './ActionPanel';
import List from './List';

// 声明 BaseCommand 接口
export interface BaseCommand {
  name: string;
  title?: string;
  keywords?: string[];
  description?: string;
  mode?: string;
  icon?: string | React.ReactNode;
  extension?: string;
}

// ExitAndClearSearch 函数
export const ExitAndClearSearch = () => {
  searchManager.clearSearch();
  exitPanel();
};

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

// SimpleCommand 组件
interface SimpleCommandProps extends BaseCommand {
  handle: () => void;
  endAfterRun?: boolean;
}

const SimpleCommand: React.FC<SimpleCommandProps> = ({ handle, endAfterRun, ...props }) => {
  const finalHandle = endAfterRun
    ? () => {
        handle();
        ExitAndClearSearch();
      }
    : handle;

  return (
    <List.Item
      id={props.name}
      key={props.name}
      title={props.title || props.name}
      {...props}
      onSelect={finalHandle}
      actions={
        <ActionPanel head={props.title}>
          <ActionPanel.Section>
            <Action.ExecuteCommand handle={finalHandle} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

// PlaceholderCommand 组件
const PlaceholderCommand: React.FC = () => {
  return <List.Item cls="!hidden" id={'placeholder'} key={'placeholder'} title={'placeholder'} />;
};

// 导出 CommandPanel 和 Command 组件
const Command = {
  SimpleCommand,
  PlaceholderCommand
};

export { Command, CommandPanel };
