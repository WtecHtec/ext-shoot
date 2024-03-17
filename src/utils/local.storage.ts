import { Storage } from "@plasmohq/storage"
import { EXTENDED_INFO_CACHE, ICON_CACHE } from "~config/cache.config"
const storage = new Storage({
	area: "local"
})

/** 缓存icon */
export const setStorageByIcon = (cacheDatas) => {
	return storage.set(ICON_CACHE, cacheDatas)
}

/** 获取缓存icon */
export const getStorageIcon = () => {
	return storage.get(ICON_CACHE)
}

/** 缓存扩展信息 */
export const setExtendedInfo = async (id, key, value) => {
	const extendInfo = await storage.get(EXTENDED_INFO_CACHE) || {}
	if (!extendInfo[id]) {
		extendInfo[id] = {}
	}
	extendInfo[id][key] = value
	await storage.set(EXTENDED_INFO_CACHE, extendInfo)
}

/** 获取扩展信息  */
export const getExtendedInfo = () => {
	return storage.get(EXTENDED_INFO_CACHE)
}