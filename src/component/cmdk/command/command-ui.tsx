import { Command as CommandCMDK } from 'motion-cmdk';
import React, { useEffect, useState } from 'react';

import { ExtensionLauncher, ExtensionManagerCommand } from '~extension';
import CacheAgent from '~extension/cache-agent';
import ChatGPT from '~extension/chatgpt';
import ChromeStoreSearch from '~extension/chrome-store-search';
import ChromeStoreWebSearch from '~extension/chrome-store-web-search';
import DevTools from '~extension/devtools';
import FeishuGroupTalk from '~extension/feishu-talk';
import Flomor from '~extension/flomor';
import HistorySearch from '~extension/history-search';
import InstantOpen from '~extension/instant-open';
import Jiker from '~extension/jiker';
import QuickOpen from '~extension/quick-open';
import TableManager from '~extension/tab-manager';
import WebTraffic from '~extension/web-traffic';
import WindowsManager from '~extension/window-agent';
import X from '~extension/x';
import JueJin from '~extension/juejin';

import { Command } from '../common/Command';
import { searchManager } from '../search/search-manager';

function ExtensionWithSearchLoader() {
  const [search, setSearch] = useState(searchManager.content);
  useEffect(() => {
    const unsubscribe = searchManager.subscribe(
      ({ search }) => {
        setSearch(search);
      },
      {
        target: ['search']
      }
    );
    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    search && (
      <CommandCMDK.Group heading={`Use "${search}" with ... `}>
        <HistorySearch search={search}></HistorySearch>
        <ChromeStoreSearch search={search}></ChromeStoreSearch>
        <ChromeStoreWebSearch search={search}></ChromeStoreWebSearch>
        <InstantOpen search={search}></InstantOpen>
      </CommandCMDK.Group>
    )
  );
}

const ExtensionLoader = () => {
  return (
    <CommandCMDK.Group heading={'Results'}>
      <Command.PlaceholderCommand />
      <FeishuGroupTalk />
      <X />
      <DevTools />
      <Jiker />
      <ChatGPT />
      <Flomor />
      <WebTraffic />
      <ExtensionLauncher />
      <ExtensionManagerCommand />
      <TableManager />
      <WindowsManager />
      <CacheAgent />
      <QuickOpen />
			<JueJin />
    </CommandCMDK.Group>
  );
};

const CommandUI = () => {
  return (
    <>
      <ExtensionLoader />
      <ExtensionWithSearchLoader />
    </>
  );
};

export { CommandUI };
