import React, { useEffect } from 'react';

import { Action } from '~component/cmdk/common/Action';
import { ActionPanel } from '~component/cmdk/common/ActionPanel';
import { CommandPanel } from '~component/cmdk/common/Command';
import { ActivatePluginIcon, CopyNameIcon, EnableIcon, ShowInFinderIcon } from '~component/icons';
import { getExtensionAll } from '~utils/management';

import { ExtensionCommand } from './command-item';
import {
  onHandleActiveExtension,
  onHandleCopyName,
  onHandleCopyPluginId,
  onHandleShowInFinder,
  onHanldePulginStatus
} from './handle';

export default function App() {
  const [extDatas, setExtDatas] = React.useState([]); // 页面显示数据

  const getExtensionDatas = async () => {
    const [err, res] = await getExtensionAll();
    if (err || !Array.isArray(res)) {
      return;
    }

    setExtDatas(res);
  };

  useEffect(() => {
    getExtensionDatas();
  }, []);

  // useEffect(() => {
  //   console.log('extDatas updated', extDatas);
  // }, [extDatas]); // 这里的依赖项是extDatas

  return (
    <CommandPanel title="Extenison">
      {extDatas.map((item, index) => {
        return (
          <ExtensionCommand
            key={index + '-' + item.id}
            name={item.id}
            title={item.name}
            keywords={[item.name]}
            iconUrl={item.icon}
            cls={!item.enabled && 'grayscale'}
            handle={() => {
              onHandleActiveExtension({
                id: item.id,
                name: item.name,
                enabled: item.enabled
              });
            }}
            actions={
              <ActionPanel head={item.name}>
                <ActionPanel.Section>
                  <Action.BaseAction
                    value="Active Extension"
                    keywords={['Active Extension']}
                    icon={<ActivatePluginIcon />}
                    onSelect={() =>
                      onHandleActiveExtension({
                        id: item.id,
                        name: item.name,
                        enabled: item.enabled
                      })
                    }
                  />
                  <Action.BaseAction
                    value="Show In Finder "
                    keywords={['show', 'finder']}
                    icon={<ShowInFinderIcon />}
                    onSelect={() =>
                      onHandleShowInFinder({
                        id: item.id,
                        name: item.name
                      })
                    }
                  />

                  <Action.BaseAction
                    value="Toggle Extension Status"
                    keywords={['toggle', 'enable']}
                    icon={<EnableIcon />}
                    onSelect={() =>
                      onHanldePulginStatus({
                        id: item.id,
                        status: !item.enabled
                      })
                    }
                  />

                  <Action.BaseAction
                    value="Copy Name"
                    keywords={['copy', 'name']}
                    icon={<CopyNameIcon />}
                    onSelect={() => {
                      onHandleCopyName({
                        name: item.name
                      });
                    }}
                  />

                  <Action.BaseAction
                    value="Copy Extension Id"
                    keywords={['copy', 'id']}
                    icon={<CopyNameIcon />}
                    onSelect={() => {
                      onHandleCopyPluginId({
                        id: item.id
                      });
                    }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
      {/* <Command.SimpleCommand
                name="222-extension-info"
                title="222 Information"
                keywords={[
                    "update",
                    "extension",
                    "info",
                    "Update Extension Information"
                ]}
                handle={() => {
                    console.log('update-extension-info');
                }}
            /> */}
    </CommandPanel>
  );
}

export { App as ExtensionLauncher };
