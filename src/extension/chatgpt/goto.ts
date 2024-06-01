import TabManager from '~lib/atoms/browser-tab-manager';

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
  ChatWithModelGPT4: 'https://chatgpt.com/?model=gpt-4',
  ChatWithModelGPT4o: 'https://chatgpt.com/?model=gpt-4o'
};

// 获取网页 ，解析参数，如果没有重复 加上参数 &temporary-chat=true
