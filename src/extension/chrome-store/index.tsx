/* eslint-disable react/display-name */

import React from 'react';

import { appManager } from '~component/cmdk/app/app-manager';
import { Action } from '~component/cmdk/extension/Action';
import { ActionPanel } from '~component/cmdk/extension/ActionPanel';
import List from '~component/cmdk/extension/List';
import { searchManager } from '~component/cmdk/search/search-manager';

import { AppIcon } from './icon';

const PREFIX = 'ChromeStoreSearch2222';

const Search = ({ search }: { search: string }) => {
  const onSearch = () => {
    // 增加防抖，避免高频率调用
    appManager.startApp('Store Search');
    // 如果是 use 。。。 with 的话，这里可以传入第二个参数，不用清除
    searchManager.clearSearch();
  };

  return (
    <List.Item
      key={`${PREFIX}${search}`}
      id={`${PREFIX}${search}`}
      keywords={['chrome', search]}
      title="Chrome Store"
      icon={<AppIcon></AppIcon>}
      onSelect={onSearch}
      actions={
        <ActionPanel head="Chrome Store">
          <ActionPanel.Section>
            <Action.OpenTab url={`https://chrome.google.com/webstore/search/${search}`} />
            <Action.CopyToClipboard
              content={`https://chrome.google.com/webstore/search/${search}`}
              shortcut={{ modifiers: ['cmd'], key: 'c' }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};
export default Search;
