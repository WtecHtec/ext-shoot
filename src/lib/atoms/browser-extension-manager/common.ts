/**
 * 打开插件设置页面
 * @returns
 */
export const handleOpenExtensionPage = () => {
	const magUrl = `chrome://extensions/`;
	chrome.tabs.create({ url: magUrl });
};


/**
 * 打开插件快捷键页面
 * */
export const handleOpenExtensionShortcutsPage = () => {
	const magUrl = `chrome://extensions/shortcuts`;
	chrome.tabs.create({ url: magUrl });
};

/**
 * 刷新插件图标
 * @param param0 
 */
const handleUpdateExtIcon = () => {
	chrome.tabs.create({
			url: chrome.runtime.getURL('/tabs/update.html'),
			active: false,
	});
};


/**
 * 启用所有插件
 * @param param0 
 */
const handleEnableAllExtensions = () => {
	chrome.management.getAll().then((extensions) => {
			// 跳过自己
			extensions.forEach((ext) => {
					if (!ext.enabled) {
						if (ext.id === chrome.runtime.id) return;
						chrome.management.setEnabled(ext.id, true);
					}
			});
	});
};

/**
 * 禁止所有插件
 * @param param0 
 */
const handleDisableAllExtensions = () => {
	chrome.management.getAll().then((extensions) => {
			// 跳过自己
			extensions.forEach((ext) => {
					if (ext.enabled) {
						if (ext.id === chrome.runtime.id) return;
						chrome.management.setEnabled(ext.id, false);
					}
			});
	});
};

export const methods = {
	handleOpenExtensionPage,
	handleOpenExtensionShortcutsPage,
	handleUpdateExtIcon,
	handleEnableAllExtensions,
	handleDisableAllExtensions,
};