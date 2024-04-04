import {
    AC_ADD_RECENTLYS,
    AC_CLEAR_RECENTLYS,
    AC_CREATE_TAB,
    AC_FAVORITE,
    AC_GET_COMMANDS,
    AC_GET_RECENTLYS,
    AC_GET_SNAPSHOTS,
    AC_ICON_UPDATED,
    AC_RECENTLY_OPEN,
    AC_SNAPSHOT_CREATE,
    AC_SOLO_RUN,
    ENABLE_ALL_EXTENSION,
    EXT_UPDATE_DONE,
} from '~config/actions';
import { ExtItem } from '~utils/ext.interface';
import {
    clearRecentlyData,
    getExtendedInfo,
    getRecentlyData,
    getSnapshots,
    getStorageIcon,
    setExtendedInfo,
    setRecentlyData,
    setSnapshot,
} from '~utils/local.storage';
import { getId } from '~utils/util';


chrome.runtime.onInstalled.addListener((object) => {
    // Inject shoot on install
    const manifest = chrome.runtime.getManifest();

    const injectIntoTab = (tab) => {
        const scripts = manifest.content_scripts[0].js;
        const s = scripts.length;

        for (let i = 0; i < s; i++) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [scripts[i]],
            });
        }

        chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: [manifest.content_scripts[0].css[0]],
        });
    };

    // Get all windows
    chrome.windows.getAll(
        {
            populate: true,
        },
        (windows) => {
            let currentWindow;
            const w = windows.length;

            for (let i = 0; i < w; i++) {
                currentWindow = windows[i];

                let currentTab;
                const t = currentWindow.tabs.length;

                for (let j = 0; j < t; j++) {
                    currentTab = currentWindow.tabs[j];
                    if (!currentTab.url.includes("chrome://") && !currentTab.url.includes("chrome-extension://") && !currentTab.url.includes("chrome.google.com")) {
                        injectIntoTab(currentTab);
                    }
                }
            }
        }
    );

    if (object.reason === "install") {
        // chrome.tabs.create({ url: FIRST_URL });
        chrome.tabs.create({
            url: chrome.runtime.getURL('/tabs/welcome.html'),
        });
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // 确保至少有一个标签页是活动的
            if (tabs.length > 0) {
                // 发送消息到content脚本
                chrome.tabs.sendMessage(tabs[0].id, { action: "active_extention_launcher" }, (response) => {
                    console.log(response.result); // 接收并打印content脚本发送的响应
                });
            }
        });
    }
});

// // 点击icon的时候，打开插件主页
chrome.action.onClicked.addListener(() => {
    // 模拟发送Action的命令
    // 获取当前活动的标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // 确保至少有一个标签页是活动的
        if (tabs.length > 0) {
            // 发送消息到content脚本
            chrome.tabs.sendMessage(tabs[0].id, { action: "active_extention_launcher" }, (response) => {
                console.log(response.result); // 接收并打印content脚本发送的响应
            });
        }
    });
});

/**
 * 获取插件列表
 * @param param0
 */
const getExtensions = ({ sendResponse }) => {
    chrome.management.getAll().then(async (extensions) => {
        const result: ExtItem[] = [];
        const iconData = (await getStorageIcon()) || {};
        const extendInfo = (await getExtendedInfo()) || {};
        for (let i = 0; i < extensions.length; i++) {
            const { id, name, description, installType, enabled } = extensions[i];
            result.push({
                id,
                name,
                description,
                icon: iconData[id] || '',
                installType,
                enabled,
                ...(extendInfo[id] || {}),
            });
        }
        sendResponse({ extensions: result });
    });
};

/**
 * 激活插件状态
 * @param param0
 */
const handleEnableExtension = ({ request, sendResponse }) => {
    const { extensionId, status } = request;
    chrome.management.setEnabled(extensionId, status, () => {
        sendResponse({ status: 'Extension enabled' });
    });
};

/**
 * 卸载插件
 * @param param0
 */
const handleUninstallExtension = ({ request, sendResponse }) => {
    const { extensionId } = request;
    try {
        chrome.management.uninstall(extensionId, {}, () => {
            console.log('取消卸载', chrome.runtime.lastError);
            sendResponse({ status: chrome.runtime.lastError ? 'error' : 'success' });
        });
    } catch (error) {
        console.log('取消卸载', error);
    }
};

/**
 * 打开插件设置
 * @param param0
 */
const handleOpenOptionsPage = ({ request, sendResponse }) => {
    const { extensionId } = request;
    chrome.management.get(extensionId, (extensionInfo) => {
        if (extensionInfo.optionsUrl) {
            chrome.tabs.create({ url: extensionInfo.optionsUrl });
            sendResponse({ status: 'Options page opened' });
        } else {
            sendResponse({ status: 'No options page available' });
        }
    });
};

/**
 * 插件详情
 * @param param0
 */
const handleOpenExtensionDetails = ({ request, sendResponse }) => {
    const { extensionId } = request;
    const detailsUrl = `chrome://extensions/?id=${extensionId}`;
    chrome.tabs.create({ url: detailsUrl });
    setRecentlyData({
        value: 'execute_recent_action',
        extIds: [extensionId],
        name: `Open Extension Detail`,
        pendingUrl: detailsUrl,
    });
    sendResponse({ status: 'Extension details page opened' });
};

/**
 *  插件管理页面
 * @param param0
 * @returns
 */
const handleOpenExtensionPage = ({ sendResponse }) => {
    const magUrl = `chrome://extensions/`;
    chrome.tabs.create({ url: magUrl });
    sendResponse({ status: 'Extension home page opened' });
    return true;
};

// arc://extensions/shortcuts
/**
 * 打开插件快捷键页面
 */
function handleOpenExtensionShortcutsPage({ sendResponse }) {
    const magUrl = `chrome://extensions/shortcuts`;
    chrome.tabs.create({ url: magUrl });
    sendResponse({ status: 'Extension shortcuts page opened' });
    return true;
}

/**
 * 获取并发送扩展图标
 */
// function handleGetExtensionIcon({ request, sendResponse }) {
//   const { extensionId, iconSize = '128' } = request; // 你可以根据需要设置默认图标大小
//   console.log(extensionId);
//   chrome.management.get(extensionId, (extensionInfo) => {
//     if (extensionInfo.icons && extensionInfo.icons.length > 0) {
//       let iconUrl = extensionInfo.icons.find(icon => icon.size === iconSize) || extensionInfo.icons[0].url; // 尝试匹配请求的大小，否则使用第一个可用的图标
//       fetch(iconUrl as string)
//         .then(response => response.blob())
//         .then(blob => {
//           const reader = new FileReader();
//           reader.onloadend = function() {
//             sendResponse({ status: "Icon fetched", iconDataUrl: reader.result });
//           };
//           reader.readAsDataURL(blob);
//         })
//         .catch(error => {
//           console.error('Error fetching icon:', error);
//           sendResponse({ status: "Error fetching icon", error: error.toString() });
//         });
//     } else {
//       sendResponse({ status: "No icon available" });
//     }
//   });
//   return true; // 保持消息通道打开
// }
//

function handleGetExtensionIcon({ request, sendResponse }) {
    const { extensionId, iconSize = '128' } = request;
    chrome.management.get(extensionId, (extensionInfo) => {
        if (extensionInfo.icons && extensionInfo.icons.length > 0) {
            // 尝试匹配请求的大小，否则使用第一个可用的图标
            const icon =
                extensionInfo.icons.find((icon) => icon.size == iconSize) ||
                extensionInfo.icons[0];

            // 替换协议 chrome:// 为 chrome-extension://
            // 直接发送图标的URL，不尝试下载
            const iconURL = icon.url;
            console.log(iconURL);

            // 发送get_extension_icon_blob消息
            chrome.runtime.sendMessage(
                {
                    action: 'get_extension_icon_blob',
                    iconURL,
                },
                (response) => {
                    console.log(response);
                    sendResponse({
                        status: 'Icon fetched',
                        iconDataUrl: response.iconDataUrl,
                    });
                },
            );

            // sendResponse({ status: 'Icon fetched', iconDataUrl: iconURL });
        } else {
            sendResponse({ status: 'No icon available' });
        }
    });
    return true; // 保持消息通道打开
}

const handleUpdateExtIcon = ({ sendResponse }) => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('/tabs/update.html'),
        active: false,
    });
    sendResponse({ status: 'update' });
};

const handleDisableAllExt = ({ request, sendResponse }) => {
    const { snapType, extIds } = request;
    chrome.management.getAll().then((extensions) => {
        // 跳过自己
        extensions.forEach((ext) => {
            if (ext.enabled) {
                if (ext.id === chrome.runtime.id) return;
                if (snapType === 'all') {
                    chrome.management.setEnabled(ext.id, false);
                } else if (extIds.includes(ext.id)) {
                    chrome.management.setEnabled(ext.id, false);
                }
            }
        });
        sendResponse({ status: 'All extensions disabled' });
    });
};
const handleEnableAllExt = ({ request, sendResponse }) => {
    const { snapType, extIds } = request;
    chrome.management.getAll().then((extensions) => {
        // 跳过自己
        extensions.forEach((ext) => {
            if (!ext.enabled) {
                if (ext.id === chrome.runtime.id) return;
                if (snapType === 'all') {
                    chrome.management.setEnabled(ext.id, true);
                } else if (extIds.includes(ext.id)) {
                    chrome.management.setEnabled(ext.id, true);
                }
            }
        });
        sendResponse({ status: 'All extensions enable' });
    });
};

const handleFavoriteExt = async ({ request, sendResponse }) => {
    const { id, value } = request;
    await setExtendedInfo(id, 'favorite', value);
    sendResponse({ status: 'Favorite' });
};


/** 打开最近使用 */
const handleOpenRecently = async ({ request, sendResponse }) => {
    const { pendingUrl } = request;
    chrome.tabs.create({ url: pendingUrl });
    sendResponse({ status: 'Open Recently' });
};

/** 更新通知转发当前tab */
const handleIconUpdated = async ({ sendResponse }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // 向content.js发送消息
        chrome.tabs.sendMessage(tabs[0].id, { action: AC_ICON_UPDATED }, function (response) {
            console.log(response?.result);
        });
    });
    sendResponse({ status: 'Icon Updated' });
};

/**
 * 创建快照 即：当前启用的插件
 * @param param0
 */
const handleCreateSnapshot = async ({ request, sendResponse }) => {
    const { id, name, extIds } = request;
    const snapshots = await getSnapshots() || [];
    const fditem = snapshots.find((item) => item.id === id);
    if (fditem) {
        fditem.id = fditem.id || getId();
        fditem.extIds = [...extIds];
    } else {
        snapshots.push({
            id: getId(),
            name,
            extIds,
        });
    }
    await setSnapshot(snapshots);
    sendResponse({ status: 'Create Snapshot' });
};

/**
 * 获取所有快照
 * @param param0
 */
const handleGetSnapshots = async ({ sendResponse }) => {
    const snapshots = await getSnapshots();
    sendResponse({ snapshots });
};
/**
 * 获取用户快捷设置
 * @param param0
 */
const handleGetCommands = async ({ sendResponse }) => {
    chrome.commands.getAll(
        (commands) => {
            console.log('commands---', commands);
            const commandMapping = {};
            commands.forEach(({ name, shortcut }) => {
                if (shortcut) {
                    commandMapping[name] = shortcut.replace(/\+/g, ' ');
                }
            });
            sendResponse({ commandMapping });
        });

};

const handeleGetRecentlys = async ({ sendResponse }) => {
    const recentlys = await getRecentlyData();
    sendResponse({ recentlys });
};

const handleAddRecently = async ({ request, sendResponse }) => {
    const { params } = request;
    await setRecentlyData({ ...params });
    sendResponse({ status: 'recently added' });
};

const handleClearRecentlys = async ({ sendResponse }) => {
    await clearRecentlyData();
    sendResponse({ status: 'recently clear' });
};

const handleSoloRunExt = async ({ request, sendResponse }) => {
    const { extId } = request;
    // 打开这个插件
    // 除了这个插件和自己外，其他插件都禁用
    chrome.management.getAll().then((extensions) => {
        extensions.forEach((ext) => {
            if (ext.id === chrome.runtime.id) return;
            if (ext.id === extId) {
                chrome.management.setEnabled(ext.id, true);
            } else {
                chrome.management.setEnabled(ext.id, false);
            }
        });
        sendResponse({ status: 'Solo Run' });
    });
};


const handleCreateTabPage = ({ request, sendResponse }) => {
	const { pageUrl, active } = request;
	chrome.tabs.create({
			url: pageUrl,
			active: active,
	});
	sendResponse({ status: 'create tab page' });
};

const ACTICON_MAP = {
    get_extensions: getExtensions,
    enable_extension: handleEnableExtension,
    uninstall_extension: handleUninstallExtension,
    open_options_page: handleOpenOptionsPage,
    open_extension_details: handleOpenExtensionDetails,
    get_extension_icon: handleGetExtensionIcon,
    disable_all_extension: handleDisableAllExt,
    open_extension_homepage: handleOpenExtensionPage,
    open_extension_shortcuts: handleOpenExtensionShortcutsPage,
    [EXT_UPDATE_DONE]: handleUpdateExtIcon,
    [ENABLE_ALL_EXTENSION]: handleEnableAllExt,
    [AC_FAVORITE]: handleFavoriteExt,
    [AC_RECENTLY_OPEN]: handleOpenRecently,
    [AC_ICON_UPDATED]: handleIconUpdated,
    [AC_SNAPSHOT_CREATE]: handleCreateSnapshot,
    [AC_GET_SNAPSHOTS]: handleGetSnapshots,
    [AC_GET_COMMANDS]: handleGetCommands,
    [AC_GET_RECENTLYS]: handeleGetRecentlys,
    [AC_ADD_RECENTLYS]: handleAddRecently,
    [AC_CLEAR_RECENTLYS]: handleClearRecentlys,
    [AC_SOLO_RUN]: handleSoloRunExt,
		[AC_CREATE_TAB]: handleCreateTabPage,
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 获取插件列表
    const { action } = request;
    if (typeof ACTICON_MAP[action] === 'function') {
        ACTICON_MAP[action]({ request, sender, sendResponse });
    } else {
        console.log('action---->', action);
    }
    return true; // 表示我们将异步发送响应
});

/**
 * 监听此插件的更新,通知更新
 */
// chrome.runtime.onInstalled.addListener(function (details) {
//   const { reason } = details
//   if (['install', 'update'].includes(reason)) {
//     // 通知更新
//     // 获取当前活动选项卡
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       // 向content.js发送消息
//       chrome.tabs.sendMessage(tabs[0].id, { action: EXT_UPDATE }, function (response) {
//         console.log(response.result);
//       });
//     });
//   }
// });


/**
 * 根据tab判断chrome-extension
 */
chrome.tabs.onCreated.addListener(function (tab) {
    const { id } = tab;
    chrome.tabs.get(id, (info) => {
        const { pendingUrl } = info;
        const regex = /chrome-extension:\/\/([a-zA-Z0-9]+)\//;
        const match = pendingUrl?.match(regex);
        if (match && match[1] && match[1] !== chrome.runtime.id) {
            const extensionId = match[1];
            setRecentlyData({
                value: 'recently_used',
                extIds: [extensionId],
                name: ``,
                pendingUrl: pendingUrl,
            });
        }
    });
});


/**
 *  监听快捷指令
 */
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // 向content.js发送消息
        chrome.tabs.sendMessage(tabs[0].id, { action: command }, function (response) {
            console.log(response?.result);
        });
    });
});
