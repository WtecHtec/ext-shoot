import { Storage } from "@plasmohq/storage"

import { GLOAL_WIN_INFO } from "~config/cache.config";

interface WinInfo {
  windowId: number,
  tabId: number,
}

const storage = new Storage({
  area: "local"
})

/** 存储弹出信息 */
export const setStorageByWinInfo = (windowId, tabId) => {
  return storage.set(GLOAL_WIN_INFO, { windowId, tabId })
}

/** 存储弹出信息 */
export const getStorageByWinInfo = (): Promise<WinInfo> => {
  return storage.get(GLOAL_WIN_INFO)
}

export const removeStorgaeByKey = (key) => {
  return storage.remove(key)
}
