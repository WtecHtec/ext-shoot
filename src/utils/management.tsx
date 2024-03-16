import { AC_FAVORITE, AC_RECENTLY_OPEN, EXT_UPDATE_DONE } from '~config/actions';
/**
 * 获取插件列表
 * @returns
 */
export const getExtensionAll = (): Promise<[null | Error, ExtItem[] | null]> => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: 'get_extensions' },
		).then(async (response) => {
			const extensions = response.extensions;
			resolve([null, extensions]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
};

/**
 * 打开插件设置页面
 * @returns
 */
export const handleOpenOtions = (extensionId: string): Promise<[null | Error, any]> => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: 'open_options_page', extensionId },
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
};

/**
 * 插件详情
 * @param extensionId
 * @returns
 */
export const handleOpenExtensionDetails = (extensionId: string): Promise<[null | Error, any]> => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: 'open_extension_details', extensionId },
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
};

/**
 * 获取插件图标
 * @param extensionId
 * @returns
 */
export const handleGetExtensionIcon = (extensionId: string, iconSize: string): Promise<[null | Error, any]> => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: 'get_extension_icon', extensionId, iconSize },
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
};

/**
 * 触发更新icon
 * @returns 
 */
export const handleExtUpdateDone = () => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: EXT_UPDATE_DONE, },
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
}


/**
 * 收藏
 * @returns 
 */
export const handleExtFavoriteDone = (id, value) => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: AC_FAVORITE, id, value },
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
}

/**
 *  打开最近使用插件页面
 * @param id
 * @param pendingUrl 
 * @returns 
 */
export const handleOpenRecently = (pendingUrl) => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: AC_RECENTLY_OPEN, pendingUrl },
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
}

