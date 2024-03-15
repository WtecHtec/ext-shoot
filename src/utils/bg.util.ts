import { GLOAL_WIN_INFO } from "~config/cache.config";
import { setStorageByWinInfo, removeStorgaeByKey, getStorageByWinInfo } from "./storage.util";

/** 关闭 */
export const doCloseCrxWin = async () => {
  const { windowId } = await getStorageByWinInfo() || {};
  if (windowId >= 0) {
    chrome.windows.remove(windowId, () => { 
      removeStorgaeByKey(GLOAL_WIN_INFO)
    });
  }
}

/** 打开 */
export const doOpenCrxWin = () => {
  chrome.windows.create({
    url: chrome.runtime.getURL("/tabs/index.html"),
    type: "panel",
    width: 700,
    height: 475,
    focused: true,
  }, async (window) => {
    const { id, tabs } = window
    // const [ width,height ]  = await getContentRect(tabs[0].id)
    // chrome.windows.update(id, { height, width });
    setStorageByWinInfo(id, tabs[0].id)
  });
}


/** 获取内容高宽  因为chrome.scripting.executeScript()主要用于在常规网页中执行脚本，而不是在扩展程序内部页面中 */
export const getContentRect = (id): Promise<[number, number]> => {
  function getRect() { return [document.documentElement.scrollWidth, document.documentElement.scrollHeight] }
  return new Promise(resolve => {
    chrome.scripting
    .executeScript({
      target : { tabId : id },
      func : getRect,
    })
    .then((res) => {
      console.log('executeScript res---', res)
      const [ width, height] = res as any
      resolve([ width, height]);
    }).catch(err => {
      console.log('executeScript err---', err)
      resolve([700, 600])
    });
  })
} 