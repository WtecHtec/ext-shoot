/* eslint-disable react/display-name */

import { Command } from 'motion-cmdk';
import React from 'react';

import ChromeStoreSearch from '~extension/chrome-store-search';
import ChromeStoreWebSearch from '~extension/chrome-store-web-search';
import HistorySearch from '~extension/history-search';
import InstantOpen from '~extension/instant-open';

function ExtensionWithSearch({ search }: { search: string }) {
  return (
    <Command.Group heading={`Use "${search}" with ... `}>
      <HistorySearch search={search}></HistorySearch>
      <ChromeStoreSearch search={search}></ChromeStoreSearch>
      <ChromeStoreWebSearch search={search}></ChromeStoreWebSearch>
      <InstantOpen search={search}></InstantOpen>
    </Command.Group>
  );
}
export default ExtensionWithSearch;
