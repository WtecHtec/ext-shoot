import React from 'react';
import DisableAllIcon from 'react:~asset/disable-all-extension.svg';
import EnableAllIcon from 'react:~asset/enable-all-extension.svg';
import ExtensionHomePageIcon from 'react:~asset/extension-homepage.svg';
import ExtensionShortcutIcon from 'react:~asset/extension-shortcut.svg';
import ExtensionClearRecentIcon from 'react:~asset/clear-recent.svg';
import ExtensionAddSnapShot from 'react:~asset/snapshoot.svg';

import RefreshExtensionInfo
    from 'react:~asset/refresh_entension_infomation.svg';
import {
    ActivatePluginIcon,
    CopyNameIcon,
    DetailPageIcon,
    DisableIcon,
    EnableIcon,
    ExecuteRecentActionIcon,
    FreshIcon,
    ShowInFinderIcon,
    SoloModeIcon,
    StarItIcon,
    StoreIcon,
    UninstallIcon,
} from '~component/icons';
import {AC_CLEAR_RECENTLYS, AC_SET_BROWSER, ENABLE_ALL_EXTENSION} from '~config/actions';
import {handleExtUpdateDone} from '~utils/management';
import { footerTip } from '~component/cmdk/tip/tip-ui';

/**
 * 禁用其他插件
 * @returns
 */
const handleDisableAllExtension = (
    params: any,
): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        // todo Notification
        const { extDatas, snapType } = params;
        const extIds = [...extDatas];
        chrome.runtime
            .sendMessage({ action: 'disable_all_extension', snapType, extIds })
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
 * 打开插件设置页面
 * @returns
 */
const handleOpenExtensionPage = (): Promise<[null | Error, any]> => {
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
const handleOpenExtensionShortcutsPage = (): Promise<[null | Error, any]> => {
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

// 清楚最近使用
// 打开插件快捷键页面
const handleClearRecently = (): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        chrome.runtime
            .sendMessage({ action: AC_CLEAR_RECENTLYS })
            .then(async (response) => {
                footerTip('success', 'Clear Recently Accessed Success', 3000);
                resolve([null, response]);
            })
            .catch((err) => {
                footerTip('error', 'Clear Recently Accessed Error', 3000);
                resolve([err, null]);
            });
    });
};

/**
 * 启用其他插件
 * @returns
 */
const handleEnableAllExtension = (
    params: any,
): Promise<[null | Error, any]> => {
    const { extDatas, snapType } = params;
    const extIds = [...extDatas];
    return new Promise((resolve) => {
        // todo Notification
        chrome.runtime
            .sendMessage({ action: ENABLE_ALL_EXTENSION, snapType, extIds })
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

// 更新插件信息
// const handleUpdateExtensionInfo = (): Promise<[null | Error, any]> => {
//     return new Promise((resolve) => {
//         chrome.runtime
//             .sendMessage({ action: 'update_extension_info' })
//             .then(async (response) => {
//                 resolve([null, response]);
//             })
//             .catch((err) => {
//                 resolve([err, null]);
//             });
//     });
// };

export const HandleIconUpdate = () => {
    footerTip('loading', 'Update Extension Info ...', 5000);
    handleExtUpdateDone();
};
export const CommandMeta = [
    {
        name: 'Update Extension Information',
        value: 'update_extension_info',
        keywords: ['update', 'extension', 'info', 'Update Extension Information'],
        icon: <RefreshExtensionInfo/>,
        desc: 'Update Extension Information',
        refresh: true,
        handle: HandleIconUpdate,
    },
    {
        name: 'Disable all Extension',
        value: 'disable_all_extension',
        keywords: ['ban', 'disable', 'Disable all Extension'],
        icon: <DisableAllIcon/>,
        desc: 'Disable all extensions in the browser',
        refresh: true,
        handle: handleDisableAllExtension,
    },
    {
        name: 'Enable all Extension',
        value: 'enable_all_extension',
        keywords: ['enable', 'Enable all Extension'],
        icon: <EnableAllIcon/>,
        refresh: true,
        desc: 'Enable all extensions in the browser',
        handle: handleEnableAllExtension,
    },
    // Open Extension Page
    {
        name: 'Open Extension HomePage',
        value: 'open_extension_home_page',
        keywords: ['open', 'extension', 'home', 'Open Extension HomePage'],
        icon: <ExtensionHomePageIcon/>,
        desc: 'Open Extension Page',
        handle: handleOpenExtensionPage,
    },
    // 打开插件快捷键页面
    {
        name: 'Change Extenion Shortcuts',
        value: 'change_extension_shortcuts',
        keywords: [
            'shortcuts',
            'Change Extenion Shortcuts',
            'key',
            'keymap',
            'keybindings',
            'keyboard',
        ],
        icon: <ExtensionShortcutIcon/>,
        desc: 'Change Extenion Shortcuts',
        handle: handleOpenExtensionShortcutsPage,
    },
    // 清楚最近使用
    {
        name: 'Clear Recently Accessed',
        value: 'clear_recently',
        keywords: ['clear', 'recently', 'Clear Recently Accessed', 'recent', 'reset'],
        icon: <ExtensionClearRecentIcon/>,
        desc: 'Clear Recently Access',
        handle: handleClearRecently,
    },
    {
        name: 'Add Snapshot',
        value: 'add_snapshot',
        keywords: ['create', 'snapshot', 'Add Snapshot'],
        icon: <ExtensionAddSnapShot/>,
        desc: 'Create Snapshot',
        handle: null,

    },
];

type SubItemAction = {
    shortcut?: string
    icon: React.ReactNode
    name: string
    desc: string
    value: string
    keywords: string[]
    group?: string
    label?: 'Extension' | 'Command'
}
export const SUB_EXTENSION_ACTIONS: Array<SubItemAction> = [
    // {
    //     shortcut: '↵',
    //     icon: <ExecuteRecentActionIcon/>,
    //     name: 'Execute Recent Action',
    //     desc: 'Execute Recent Action',
    //     value: 'execute_recent_action',
    //     keywords: ['execute', 'recent', 'action', 'Execute Recent Action'],
    //     group: 'common',
    // },
    {
        shortcut: '',
        icon: <ActivatePluginIcon/>,
        name: 'Active Plugin',
        desc: 'Active Plugin',
        value: 'active_plugin',
        keywords: ['active', 'plugin', 'Active Plugin'],
        group: 'common',
    },
    {
        shortcut: '',
        icon: <FreshIcon/>,
        name: 'Reload Plugin',
        desc: 'Reload plugin',
        value: 'reload_plugin',
        keywords: ['reload', 'plugin', 'Reload Plugin'],
        group: 'common',
    },
    {
        shortcut: '',
        icon: <StarItIcon/>,
        name: 'Add to Favorites',
        desc: 'Add to Favorites',
        value: 'add_to_favorites',
        keywords: ['favorites', 'add', 'Add to Favorites'],
        group: 'common',
    },
    {
        shortcut: '',
        icon: <StoreIcon/>,
        name: 'Open In Web Store',
        desc: 'Open In Web Store',
        value: 'open_in_web_store',
        keywords: ['open', 'web', 'store', 'open in web store', 'web store'],
        group: 'common',
    },
    {
        shortcut: '',
        icon: <DetailPageIcon/>,
        name: 'Open Detail Page',
        desc: 'Open Detail Page',
        value: 'open_detail_page',
        keywords: ['open', 'detail', 'page', 'Open Detail Page'],
        group: 'common',
    },

    {
        shortcut: '',
        icon: <ShowInFinderIcon/>,
        name: 'Show in Finder',
        desc: 'Show in Finder',
        value: 'show_in_finder',
        keywords: ['show', 'finder', 'Show in Finder'],
        group: 'dev',
    },

    {
        shortcut: '',
        icon: <CopyNameIcon/>,
        name: 'Copy Plugin ID',
        desc: 'Copy Plugin ID',
        value: 'copy_plugin_id',
        keywords: ['copy', 'plugin', 'id', 'Copy Plugin ID'],
        group: 'dev',
    },
    {
        shortcut: '',
        icon: <CopyNameIcon/>,
        name: 'Copy Plugin Name',
        desc: 'Copy Plugin Name',
        value: 'copy_plugin_name',
        keywords: ['copy', 'plugin', 'name', 'Copy Plugin Name'],
        group: 'dev',
    },
    {
        shortcut: '',
        icon: <SoloModeIcon/>,
        name: 'Solo Run Extension',
        desc: 'Solo Run Extension',
        value: 'solo_run_extension',
        keywords: ['solo', 'run', 'extension', 'Solo Run Extension'],
        group: 'dev',
    },

    {
        shortcut: '',
        icon: <DisableIcon/>,
        name: 'Disable Plugin',
        desc: 'Disable Plugin',
        value: 'disable_plugin',
        keywords: ['disable', 'plugin', 'Disable Plugin'],
        group: 'danger',
    },
    {
        shortcut: '',
        icon: <EnableIcon/>,
        name: 'Enable Plugin',
        desc: 'Enable Plugin',
        value: 'enable_plugin',
        keywords: ['enable', 'plugin', 'Enable Plugin'],
        group: 'danger',
    },
    {
        shortcut: '',
        icon: <UninstallIcon/>,
        name: 'Uninstall Plugin',
        desc: 'Uninstall Plugin',
        value: 'uninstall_plugin',
        keywords: ['uninstall', 'plugin', 'Uninstall Plugin'],
        group: 'danger',
    },

];

export const SUB_COMMAND_ACTIONS: Array<SubItemAction> = [
    {
        shortcut: '↵',
        icon: <ExecuteRecentActionIcon/>,
        name: 'Execute Command',
        desc: 'Execute Command',
        value: 'execute_command',
        keywords: ['execute', 'command', 'Execute Command'],
        group: 'command',
    },
];

export const getSubCommandActionMap = () => {
    const mapping = {};
    SUB_COMMAND_ACTIONS.forEach(item => {
        mapping[item.value] = item;
    });
    return mapping;
};

export const getSubExtensionActionMap = () => {
    const mapping = {};
    SUB_EXTENSION_ACTIONS.forEach(item => {
        mapping[item.value] = item;
    });
    return mapping;
};

export const getAllActionMap = () => {
    const mapping = {};
    SUB_EXTENSION_ACTIONS.forEach(item => {
        item.label = 'Extension';
        mapping[item.value] = item;
    });
    SUB_COMMAND_ACTIONS.forEach(item => {
        item.label = 'Command';
        mapping[item.value] = item;
    });
    return mapping;
};

export const getCommandMetaMap = () => {
    const mapping = {};
    CommandMeta.forEach(item => {
        // 给所有的command加一个label command 用于搜所
        item.keywords.push('command');
        mapping[item.value] = item;
    });
    return mapping;
};


// 设置当前的浏览器
// 打开插件快捷键页面
export const handleSetBrowser = (
    browserType: string,
): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        chrome.runtime
            .sendMessage({
                action: AC_SET_BROWSER
                , browserType,
            })
            .then(async (response) => {
                resolve([null, response]);
            })
            .catch((err) => {
                resolve([err, null]);
            });
    });
};
