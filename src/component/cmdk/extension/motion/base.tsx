// 声明 BaseCommand 接口
import React from 'react';

import { Action } from '~component/cmdk/extension/Action';
import { ActionPanel } from '~component/cmdk/extension/ActionPanel';
import List from '~component/cmdk/extension/List';
import { ExitAndClearSearch } from '~component/cmdk/extension/motion/index';
import { NavigatorIcon } from '~component/icons';

export interface BaseCommand {
  name: string;
  title?: string;
  keywords?: string[];
  description?: string;
  mode?: string;
  icon?: string | React.ReactNode;
  extension?: string;
}

// Simple 组件
interface SimpleProps extends BaseCommand {
  handle: () => void;
  endAfterRun?: boolean;
}

export const Simple: React.FC<SimpleProps> = ({ handle, endAfterRun, ...props }) => {
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
export const PlaceholderCommand: React.FC = () => {
  return <List.Item cls="!hidden" id={'placeholder'} key={'placeholder'} title={'placeholder'} />;
};

export interface NavigatorCommandProps extends Omit<BaseCommand, 'name'> {
  url: string;
  name?: string;
  newTab?: boolean; // 默认是否在新标签页中打开
}

export const Navigator: React.FC<NavigatorCommandProps> = ({ url, newTab = false, ...props }) => {
  const navigate = newTab ? () => Action.OpenTab.run({ url }) : () => Action.GoTo.run({ url });
  const name = props?.name || props.title;
  return (
    <List.Item
      id={name}
      key={name}
      title={props.title}
      {...props}
      labels={[<NavigatorIcon key="icon" />]}
      onSelect={navigate}
      actions={
        <ActionPanel head={props.title}>
          <ActionPanel.Section title="Navigate">
            <Action.GoTo url={url} />
            <Action.OpenTab url={url} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};
