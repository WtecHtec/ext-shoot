import {footerTip} from '~component/cmdk/tip/tip-ui';
import {ENABLE_ALL_EXTENSION} from '~config/actions';
import {handleExtUpdateDone} from '~utils/management';

/**
 * 禁用其他插件
 * @returns
 */
export const handleDisableAllExtension = (): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        chrome.runtime
            .sendMessage({
                action: 'disable_all_extension',
                snapType: 'all',
                extIds: null,
            })
            .then(async (response) => {
                footerTip('success', 'Disable All Extension Success', 3000);
                resolve([null, response]);
            })
            .catch((err) => {
                footerTip('error', 'Disable All Extension Error', 3000);
                resolve([err, null]);
            });
    });
};
/**
 * 启用其他插件
 * @returns
 */
export const handleEnableAllExtension = (): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        // todo Notification
        chrome.runtime
            .sendMessage({ action: ENABLE_ALL_EXTENSION, snapType: 'all', extIds: null })
            .then(async (response) => {
                footerTip('success', 'Enable All Extension Success', 3000);
                resolve([null, response]);
            })
            .catch((err) => {
                footerTip('error', 'Enable All Extension Error', 3000);
                resolve([err, null]);
            });
    });
};
/**
 * 打开插件设置页面
 * @returns
 */
export const handleOpenExtensionPage = (): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        chrome.runtime
            .sendMessage({ action: 'open_extension_homepage' })
            .then(async (response) => {
                resolve([null, response]);
            })
            .catch((err) => {
                resolve([err, null]);
            });
    });
};
// 打开插件快捷键页面
export const handleOpenExtensionShortcutsPage = (): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        chrome.runtime
            .sendMessage({ action: 'open_extension_shortcuts' })
            .then(async (response) => {
                resolve([null, response]);
            })
            .catch((err) => {
                resolve([err, null]);
            });
    });
};
export const HandleIconUpdate = () => {
    footerTip('loading', 'Update Extension Info ...', 5000);
    handleExtUpdateDone();
};
