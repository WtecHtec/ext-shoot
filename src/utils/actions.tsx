import React from 'react';
import DisableAllIcon from 'react:~component/asset/disable-all-extension.svg';
import ExtensionHomePageIcon from 'react:~component/asset/extension-homepage.svg';
import ExtensionShortcutIcon from 'react:~component/asset/extension-shortcut.svg';
import EnableAllIcon from 'react:~component/asset/enable-all-extension.svg';
import {ENABLE_ALL_EXTENSION} from '~config/actions';
import {
    CameraIcon,
    CopyNameIcon, DisableIcon, EnableIcon, FreshIcon,
    OpenRecentPageIcon,
    ShowInFinderIcon, StarItIcon, UninstallIcon,
} from '~component/icons';

/**
 * 禁用其他插件
 * @returns
 */
const handleDisableAllExtension = (params: any): Promise<[null | Error, any]> => {
    return new Promise((resolve) => {
        // todo Notification
        const { extDatas, snapType } = params;
        let extIds = [];
        if (snapType !== 'all') {
            extIds = extDatas[extDatas.length - 1].children.map(({ id }) => id);
        }
        chrome.runtime
            .sendMessage({ action: 'disable_all_extension', snapType, extIds })
            .then(async (response) => {
                resolve([null, response]);
            })
            .catch((err) => {
                resolve([err, null]);
            });
    });
};

/**
 * 打开插件设置页面
 * @returns
 */
const handleOpenExtensionPage = (params: any): Promise<[null | Error, any]> => {
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
const handleOpenExtensionShortcutsPage = (params: any): Promise<[null | Error, any]> => {
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

/**
 * 启用其他插件
 * @returns
 */
const handleEnableAllExtension = (params: any): Promise<[null | Error, any]> => {
    const { extDatas, snapType } = params;
    let extIds = [];
    if (snapType !== 'all') {
        extIds = extDatas[extDatas.length - 1].children.map(({ id }) => id);
    }
    return new Promise((resolve) => {
        // todo Notification
        chrome.runtime
            .sendMessage({ action: ENABLE_ALL_EXTENSION, snapType, extIds })
            .then(async (response) => {
                resolve([null, response]);
            })
            .catch((err) => {
                resolve([err, null]);
            });
    });
};

export const ActionMeta = [
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
        value: 'open_extension_page',
        keywords: ['open', 'extension', 'Open Extension Page'],
        icon: <ExtensionHomePageIcon/>,
        desc: 'Open Extension Page',
        handle: handleOpenExtensionPage,
    },
    // 打开插件快捷键页面
    {
        name: 'Change Extenion Shortcuts',
        value: 'change_extension_shortcuts',
        keywords: ['shortcuts', 'Change Extenion Shortcuts', 'key', 'keymap', 'keybindings', 'keyboard'],
        icon: <ExtensionShortcutIcon/>,
        desc: 'Change Extenion Shortcuts',
        handle: handleOpenExtensionShortcutsPage,
    },
];


type SubItemAction = {
    shortcut?: string;
    icon: React.ReactNode;
    name: string;
    desc: string;
    value: string;
    keywords: string[];
}
export const SUB_ITME_ACTIONS: Array<SubItemAction>
    = [
    {
        shortcut: '↵',
        icon: <OpenRecentPageIcon/>,
        name: 'Open Recent Page',
        desc: 'Open Recent Page',
        value: 'open_extension_page',
        keywords: ['open', 'Recent', 'extension', 'Open Extension Page'],
    },
    {
        shortcut: '',
        icon: <ShowInFinderIcon/>,
        name: 'Show in Finder',
        desc: 'Show in Finder',
        value: 'show_in_finder',
        keywords: ['show', 'finder', 'Show in Finder'],
    },
    {
        shortcut: '',
        icon: <CopyNameIcon/>,
        name: 'Copy Plugin Name',
        desc: 'Copy Plugin Name',
        value: 'copy_plugin_name',
        keywords: ['copy', 'plugin', 'name', 'Copy Plugin Name'],
    },
    {
        shortcut: '',
        icon: <FreshIcon/>,
        name: 'Reload Plugin',
        desc: 'Reload plugin',
        value: 'reload_plugin',
        keywords: ['reload', 'plugin', 'Reload Plugin'],
    },
    {
        shortcut: '',
        icon: <CameraIcon/>,
        name: 'Open Snapshot Dialog',
        desc: 'Open Snapshot Dialog',
        value: 'open_snapshot_dialog',
        keywords: ['open', 'add', 'snapshot', 'Open Snapshot Dialog'],
    },
    {
        shortcut: '',
        icon: <StarItIcon/>,
        name: 'Add to Favorites',
        desc: 'Add to Favorites',
        value: 'add_to_favorites',
        keywords: ['favorites', 'add', 'Add to Favorites'],
    },
    {
        shortcut: '',
        icon: <CopyNameIcon/>,
        name: 'Copy Plugin ID',
        desc: 'Copy Plugin ID',
        value: 'copy_plugin_id',
        keywords: ['copy', 'plugin', 'id', 'Copy Plugin ID'],
    },
    {
        shortcut: '',
        icon: <DisableIcon/>,
        name: 'Disable Plugin',
        desc: 'Disable Plugin',
        value: 'disable_plugin',
        keywords: ['disable', 'plugin', 'Disable Plugin'],
    },
    {
        shortcut: '',
        icon: <EnableIcon/>,
        name: 'Enable Plugin',
        desc: 'Enable Plugin',
        value: 'enable_plugin',
        keywords: ['enable', 'plugin', 'Enable Plugin'],
    },
    {
        shortcut: '',
        icon: <UninstallIcon/>,
        name: 'Uninstall Plugin',
        desc: 'Uninstall Plugin',
        value: 'uninstall_plugin',
        keywords: ['uninstall', 'plugin', 'Uninstall Plugin'],
    },

]

export const getSubItemActionMap = () => {
	const mapping = {}
	SUB_ITME_ACTIONS.forEach(item => {
		mapping[item.value] = item
	})
	return mapping
}