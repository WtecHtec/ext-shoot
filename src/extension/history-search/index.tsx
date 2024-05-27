/* eslint-disable react/display-name */

import React from 'react';
import ExtensionLogo from 'react:./icon.svg';

import { appManager } from '~component/cmdk/app/app-manager';
import { Action } from '~component/cmdk/common/Action';
import { ActionPanel } from '~component/cmdk/common/ActionPanel';
import List from '~component/cmdk/common/List';
import { searchManager } from '~component/cmdk/search/search-manager';

const PREFIX = 'HistorySearch';

const Search = ({ search }: { search: string }) => {
  const onSearch = () => {
    // 增加防抖，避免高频率调用
    appManager.startApp('History Search');
    // 如果是 use 。。。 with 的话，这里可以传入第二个参数，不用清除
    searchManager.clearSearch();
    console.log(`history search: ${search}`);
  };

  return (
    <List.Item
      key={`${PREFIX}${search}`}
      id={`${PREFIX}${search}`}
      keywords={['history', 'search', search]}
      title="History Search"
      icon={<ExtensionLogo />}
      onSelect={onSearch}
      author="WtecHtec"
      actions={
        <ActionPanel head="History Store">
          <ActionPanel.Section>
            <Action.ExecuteCommand
              handle={() => {
                onSearch();
              }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};
export default Search;
