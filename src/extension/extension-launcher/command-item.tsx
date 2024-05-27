import React from 'react';

import { Action } from '~component/cmdk/common/Action';
import { ActionPanel } from '~component/cmdk/common/ActionPanel';
import { BaseCommand } from '~component/cmdk/common/Command';
import List from '~component/cmdk/common/List';
import { ActivatePluginIcon, ExtensionIcon } from '~component/icons';

interface ExtensionCommandProps extends BaseCommand {
  children?: React.ReactNode;
  iconUrl?: string;
  handle: () => void;
  cls?: string;
  actions?: React.ReactNode;
}
export const ExtensionCommand = ({
  children,
  name,
  title,
  keywords,
  description,
  iconUrl,
  handle,
  cls,
  actions
}: ExtensionCommandProps) => {
  return (
    <List.Item
      id={name}
      key={name}
      title={title}
      cls={cls}
      subtitle={description}
      keywords={keywords}
      icon={<ExtensionIcon base64={iconUrl} />}
      author={null}
      onSelect={() => {
        handle();
      }}
      type={'Extension'}
      actions={
        actions ?? (
          <ActionPanel head={title}>
            <ActionPanel.Section>
              <Action.BaseAction
                value="Active Extension"
                keywords={['Active Extension']}
                icon={<ActivatePluginIcon />}
                onSelect={() => handle()}
              />
            </ActionPanel.Section>
          </ActionPanel>
        )
      }>
      {children}
    </List.Item>
  );
};
