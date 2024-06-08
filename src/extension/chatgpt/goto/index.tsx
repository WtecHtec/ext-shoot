import React from 'react';

import { Motion } from '~component/cmdk/extension/command';

import { splitCamelCase } from './util';

export const urlList = {
  MineGPTs: 'https://chatgpt.com/gpts/mine',
  GPTsStore: 'https://chatgpt.com/gpts',
  CreateNewGPTs: 'https://chatgpt.com/gpts/create',
  ChatWithGPT4: 'https://chatgpt.com/?model=gpt-4',
  ChatWithGPT4o: 'https://chatgpt.com/?model=gpt-4o',
  ChatWithJQueryGPTs: 'https://chatgpt.com/g/g-ziR7R3xl5'
};

export function createNavigators(urlList) {
  return Object.entries(urlList).map(([key, url]) => {
    return <Motion.Navigator key={key} url={url as any} title={'Go To ' + splitCamelCase(key).join(' ')} />;
  });
}

export const GotoCommandList = () => {
  return createNavigators(urlList);
};
