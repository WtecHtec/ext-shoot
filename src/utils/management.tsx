interface ExtItem {
  id: string
  name: string,
  icon: string | ArrayBuffer,
  description: string
}

/**
 * 获取插件列表¡
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
