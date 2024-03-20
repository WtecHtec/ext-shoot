import { AC_FAVORITE, AC_GET_SNAPSHOTS, AC_RECENTLY_OPEN, AC_SNAPSHOT_CREATE, EXT_UPDATE_DONE } from '~config/actions';
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


/**
 * 获取快照数据
 * @returns 
 */
export const handleGetSnapshots = () : Promise<[null | Error, any]>=> {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: AC_GET_SNAPSHOTS},
		).then(async (response) => {
			resolve([null, response.snapshots]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
}


/**
 * 创建快照数据
 * @returns 
 */
 export const handleCreateSnapshots = (id, name, extIds) => {
	return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: AC_SNAPSHOT_CREATE, id, name, extIds},
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
}

/**
 *  禁用、启用状态  status: false\ true
 */
export const handlePluginStatus = (extensionId, status) => {
  return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: 'enable_extension', extensionId, status},
		).then(async (response) => {
			resolve([null, response]);
		}).catch(err => {
			resolve([err, null]);
		});
	});
}
/**
 *  禁用、启用状态  status: false\ true
 */
 export const handleUninstallPlugin = (extensionId): Promise<[any, any]> => {
  return new Promise(resolve => {
		chrome.runtime.sendMessage(
			{ action: 'uninstall_extension', extensionId},
		).then(async (response) => {
			resolve([null, response.status === 'success']);
		}).catch(err => {
			resolve([err, null]);
		});
	});
}

