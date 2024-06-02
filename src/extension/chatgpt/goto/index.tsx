import React from 'react';

import { Command } from '~component/cmdk/extension/command';
import TabManager from '~lib/atoms/browser-tab-manager';

import { splitCamelCase } from './util';

const tabAction = TabManager.action;

export function gotoJqueryGPTs() {
  tabAction.changeCurrentTabUrl('https://chatgpt.com/g/g-ziR7R3xl5-jquery-coding-boy');
}

export function newToGPT4() {
  tabAction.createTabNextToCurrent('https://chatgpt.com/?model=gpt-4');
}

export const urlList = {
  MineGPTs: 'https://chatgpt.com/gpts/mine',
  GPTsStore: 'https://chatgpt.com/gpts',
  CreateNewGPTs: 'https://chatgpt.com/gpts/create',
  ChatWithGPT4: 'https://chatgpt.com/?model=gpt-4',
  ChatWithGPT4o: 'https://chatgpt.com/?model=gpt-4o'
};

export function createNavigators(urlList) {
  return Object.entries(urlList).map(([key, url]) => {
    return <Command.Navigator key={key} url={url as any} title={'Go To ' + splitCamelCase(key).join(' ')} />;
  });
}

export const GotoCommandList = () => {
  console.log('123', 123);
  return createNavigators(urlList);
};
