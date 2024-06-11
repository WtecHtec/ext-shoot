/* eslint-disable react/display-name */

/* eslint-disable react/display-name */
import React from 'react';

import { appManager } from '~component/cmdk/app/app-manager';
import { Motion, MotionPack } from '~component/cmdk/extension';
import { searchManager } from '~component/cmdk/search/search-manager';
import { GoogleStoreIcon } from '~component/icons';
import { splitCamelCase } from '~extension/chatgpt/goto/util';

import { AppIcon } from './icon';

const PREFIX = 'ChromeStoreSearch2222';

function chromeStoreLink(word: string): string {
  const link = `https://chromewebstore.google.com/search/${word}`;
  return link;
}

const Search = ({ search }: { search: string }) => {
  const onSearch = () => {
    // 增加防抖，避免高频率调用
    appManager.startApp('Store Search');
    // 如果是 use 。。。 with 的话，这里可以传入第二个参数，不用清除
    searchManager.clearSearch();
  };

  return (
    <MotionPack title="Chrome Store">
      <Motion.Simple
        icon={<AppIcon />}
        key={`${PREFIX}${search}`}
        name="chrome-store-search"
        title="Chrome Store Search"
        keywords={['chrome', search]}
        description="Chrome Store Search"
        handle={onSearch}></Motion.Simple>

      <Motion.Navigator
        icon={<GoogleStoreIcon />}
        keywords={['chrome', 'store', search]}
        url={chromeStoreLink(search) as any}
        title={'Search ' + splitCamelCase(search as string) + ' in Chrome Store'}
      />
    </MotionPack>
  );
};
export default Search;
