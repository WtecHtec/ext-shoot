/* eslint-disable react/no-unknown-property */

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

// import * as Select from '@radix-ui/react-select';
import axios from 'axios';

import * as clipboard from 'clipboard-polyfill';
import { Command } from 'cmdk';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner/dist';
import { AC_ICON_UPDATED } from '~config/actions';
import {
    CommandMeta,
    getAllActionMap,
    getCommandMetaMap,
    getSubCommandActionMap,
    getSubExtensionActionMap,
    SUB_COMMAND_ACTIONS,
    SUB_EXTENSION_ACTIONS,
} from '~utils/actions';
import {
    getExtensionAll,
    handleAddRecently,
    handleCreateSnapshots,
    handleExtFavoriteDone,
    handleGetAllCommands,
    handleGetRecentlys,
    handleGetSnapshots,
    handleOpenExtensionDetails,
    handleOpenRecently,
    handlePluginStatus,
    handleSoloRun,
    handleUninstallPlugin,
} from '~utils/management';

import {  ExtensionIcon, GlobeIcon, Logo, ShootIcon } from '../icons';
import { deepCopyByJson, getMutliLevelProperty } from '~utils/util';
import Item from './item';
import SubCommand from './sub-command';
import SnapshotDialog from './snapshot-dialog';
import { ExtItem } from '~utils/ext.interface';
import FooterTip, { footerTip } from '~component/cmdk/tip/footer-tip';
import Search from './search-group';
import {
    ExtShootSeverHost,
    MarkId,
    RecentlyFix,
    RecentSaveNumber,
    SearchFix,
} from '~config/config';
import SnapshotCommand from './snapshot-command';
import { getSelectSnapId, setSelectSnapIdBtStorge } from '~utils/local.storage';
import EventBus from '~utils/event-bus';
import { getExtId } from '~lib/util';
import { searchManager } from './search/SearchManager';
import SearchComponent from './search/SearchUI';

const eventBus = EventBus.getInstace();

const acMap = getAllActionMap();
const acMap_command = getSubCommandActionMap();
const acMap_Extension = getSubExtensionActionMap;
const commandMetaMap = getCommandMetaMap();


const BASE_GROUP = () => [
    {
        name: 'Recently Accessed',
        key: 'recently',
        children: [],
    },
    {
        name: 'Favorite',
        key: 'favorite',
        children: [],
    },
    {
        name: 'Development',
        key: 'development',
        children: [],
    },
];


export function RaycastCMDK() {
    const [value, setValue] = React.useState('');
    const [extDatas, setExtDatas] = React.useState([]); // 页面显示数据
    const [originDatas, setOriginDatas] = React.useState([]); // 扩展源数据, 全部
    const [, setHasUpdateStatus] = React.useState(0); // 0:无更新；1:有更新；2:更新中
    const [selectSnapId, setSelectSnapId] = React.useState('all'); // 快照id
    const [snapshots, setSnapshots] = React.useState([]); // 快照数据
    const [subCommands, setSubCommands] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listRef = React.useRef(null);
    // const [search, setSearch] = useState(null);
    const [search, setSearch] = useState(searchManager.content);

    const [container, setContainer] = React.useState(null);
    const [snapshotOpen, setSnapshotOpen] = React.useState(false);
    const [recentlys, setRecentlys] = React.useState([]);
    const extShootRef = React.useRef(null);

    const [inAppMode,setInAppMode] = React.useState(searchManager.ifInApp); // 是否进入应用


    /**
     * 获取input输入框的值
     */
    useEffect(() => {
        const unsubscribe = searchManager.subscribe((newSearch,_,__,inApp) => {
            setSearch(newSearch);
            setInAppMode(inApp);

            // inputRef_.current.focus();
            });
        return unsubscribe; // Cleanup on unmount
    }, []);

    /**
     * 获取插件数据
     * id: {
     *    group: ,
     *  favorite:
     * }
     * groups: [
     *  {
     *     name: 'Favorite'
     *    },
     *    {
     *        name: 'Development'
     *  }
     *  {
     *   name: 'All'
     *  }
     * ]
     * @returns
     */
    const getExtensionDatas = async () => {
        let selectSnapId = await getSelectSnapId();
        // console.log('获取插件数据');
        const [err, res] = await getExtensionAll();
        if (err || !Array.isArray(res)) {
            return;
        }
        const shotDatas = await getSnapShotDatas();
        console.log('shotDatas---', shotDatas, selectSnapId);
        const fshot = shotDatas.find(({ id }) => id === selectSnapId);
        selectSnapId = fshot ? selectSnapId : 'all';
        const [, recentlys] = await handleGetRecentlys();
        console.log('recentlys---', recentlys, selectSnapId);
        const [groups] = formatExtDatas(res, shotDatas, selectSnapId, recentlys ?? []);
        console.log('groups---', groups);
        setSelectSnapId(selectSnapId);
        setOriginDatas(res);
        setExtDatas(groups);
        setRecentlys(recentlys);
        setHasUpdateStatus(checkUpdate(res) ? 1 : 0);
        setLoaded(res.length > 0);
    };
    /**
     * 设置快捷键
     * @returns
     */
    const getAllCommands = async () => {
        const [err, res] = await handleGetAllCommands();
        if (err || !res) {
            return;
        }
        const subCommands = [...SUB_EXTENSION_ACTIONS, ...SUB_COMMAND_ACTIONS];
        subCommands.forEach((item) => {
            const { value } = item;
            if (res[value]) {
                (item as any).shortcut = res[value];
            }
        });
        setSubCommands(subCommands);
    };


    /** 判断 loadedicon 状态 */
    const checkUpdate = (exts) => {
        return !!exts.find(({ loadedicon }) => !loadedicon);
    };

    /** 处理分组数据, 切换快照时，可不需请求 */
    const formatExtDatas = (exts, shotDatas, selectSnapId, recentlys) => {
        shotDatas = deepCopyByJson(shotDatas);
        recentlys = deepCopyByJson(recentlys);
        exts = deepCopyByJson(exts);
        const currentSnap = shotDatas.find(({ id }) => id === selectSnapId);
        const groups = [...BASE_GROUP()];
        const currExts = [];
        const extMapping = {};
        exts.sort((a, b) => b.enabled - a.enabled).forEach(item => {
            const { installType, favorite, id } = item as ExtItem;
            extMapping[id] = item;
            if (favorite) {
                groups[1].children.push({
                    ...item,
                    id: `${groups[1].key}${MarkId}${item.id}`,
                });
            }
            if (installType === 'development') {
                groups[2].children.push({
                    ...item,
                    id: `${groups[2].key}${MarkId}${item.id}`,
                });
            }
            if (currentSnap && Array.isArray(currentSnap.extIds) && currentSnap.extIds.includes(item.id)) {
                currExts.push({
                    ...item,
                });
            }
        });

        if (selectSnapId === 'all') {
            groups.push({
                name: 'All',
                key: 'all',
                children: [...exts],
            });
        } else if (currExts.length && currentSnap) {
            groups.push({
                name: currentSnap.name,
                key: currentSnap.id,
                children: [...currExts],
            });
        }
        if (Array.isArray(recentlys) && recentlys.length) {

            let nwRecentlys = recentlys.filter(item => item);
            nwRecentlys = nwRecentlys.map((item) => {
                const { extIds, value } = item;
                item.status = false;
                item.enabled = true;
                if (value.includes(SearchFix)) {
                    item.status = true;
                    item.icon = <MagnifyingGlassIcon></MagnifyingGlassIcon>;
                } else if (extIds && extIds.length === 1 && extMapping[extIds[0]]) {
                    item.status = true;
                    item.enabled = extMapping[extIds[0]].enabled;
                    item.name = `${extMapping[extIds[0]].name}` || '';
                    item.icon = extMapping[extIds[0]].icon;
                    item.actIcon = acMap[value]?.icon || <GlobeIcon></GlobeIcon>;
                } else if (extIds && extIds.length > 0 && commandMetaMap[extIds[0]]) {
                    item.status = true;
                    item.icon = commandMetaMap[value]?.icon;
                    console.log('extIds---', extIds, extIds[1], value);
                    if (extIds[1] && ['enable_all_extension', 'disable_all_extension'].includes(value)) {
                        item.actIcon = <GlobeIcon></GlobeIcon>;
                        if (extIds[1] === 'all') {
                            item.name = `${commandMetaMap[value].name} (ALL)`;
                        } else {
                            const fsnap = shotDatas.find(({ id }) => id === extIds[1]);
                            if (fsnap) {
                                item.name = `${commandMetaMap[value].name}[${fsnap.name}]`;
                            }
                        }
                    }
                }
                return item;
            }).filter(({ status }) => status);
            nwRecentlys = nwRecentlys.sort((a, b) => b?.time - a?.time).slice(0, RecentSaveNumber);
            groups[0].children = [...nwRecentlys];
        }
        return [groups];
    };
    /** 触发按键 */
    React.useEffect(() => {
        // function listener(e: KeyboardEvent) {
        //     const key = e.key?.toUpperCase();

        //     if (e.metaKey && key === 'U') {
        //         // 更新
        //         e.preventDefault();
        //         HandleIconUpdate();
        //     }
        // }

        const handelMsgBybg = (request, sender, sendResponse) => {
            const { action } = request;
            if (action === AC_ICON_UPDATED) {
                // 在这里处理接收到的消息
                setHasUpdateStatus(0);
                getExtensionDatas();
                footerTip('success', 'Extension Info Updated Successfully', 3000);
            } else {
                onClickSubItem(action, value);
            }
            // 发送响应
            sendResponse({ result: 'Message processed in content.js' });
        };
        chrome.runtime.onMessage.addListener(handelMsgBybg);
        // document.addEventListener('keydown', listener);
        return () => {
            // document.removeEventListener('keydown', listener);
            chrome.runtime.onMessage.removeListener(handelMsgBybg);
        };
    }, [value, originDatas]);

    React.useEffect(() => {
        inputRef?.current?.focus();
        getExtensionDatas();
        getAllCommands();

        // function inputListener(event) {
        //     if ([27, 37, 38, 39, 40, 13].includes(event.keyCode)
        //         || (event.metaKey && event.key.toLocaleUpperCase() === 'K')) return;
        //     if (event.metaKey) return;
        //     // 阻止事件冒泡
        //     event.stopPropagation();
        // }

        // if (inputRef && inputRef.current) {
        //     inputRef?.current.addEventListener('keydown', inputListener);
        // }
        return () => {
            // if (inputRef?.current) {
            //     inputRef?.current.removeEventListener('keydown', inputListener);
            // }
        };
    }, []);

    // 当快照选择变化时，可以不需要重新请求接口
    useEffect(() => {
        const [groups] = formatExtDatas(originDatas, snapshots, selectSnapId, recentlys);
        setSelectSnapIdBtStorge(selectSnapId);
        setExtDatas(groups);
    }, [selectSnapId]);


    // 当搜索内容变化时，滚动到列表顶部
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = 0; // 滚动到顶部
        }
    }, [search]); // 依赖search，当search变化时，执行effect

    const getExtensionDeatilById = (id: string) => {
        return originDatas.find((ext) => ext.id === getExtId(id));
    };
    /** 当前快照 启用的插件 */
    const onSvaeSnap = async (tab, snapId, name) => {
        try {
            let extIds = extDatas[extDatas.length - 1].children.filter(
                ({ enabled }) => enabled === true,
            );
            extIds = extIds.map(({ id }) => id);
            await handleCreateSnapshots(snapId, name, extIds);
            if (tab === 'add') {
                await getSnapShotDatas();
            } else if (tab === 'replace') {
                await getExtensionDatas();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getSnapShotDatas = async () => {
        const [err, res] = await handleGetSnapshots();
        if (err || !Array.isArray(res)) {
            return [];
        }
        setSnapshots(res);
        return res;
    };


    /**
     * 收藏操作
     * @returns
     */
    const onHandelFavorite = async (extId) => {
        const extDeatil = getExtensionDeatilById(extId);
        if (!extDeatil) return;
        if (listRef.current) {
            listRef.current.scrollTop = 0; // 滚动到顶部
        }
        const favorite = extDeatil?.favorite;
        await handleExtFavoriteDone(extId, !favorite);
        await getExtensionDatas();
        footerTip('success', favorite ? 'Remove Favorite Success' : 'Add Favorite Success', 2000);
    };

    /**
     * 复制插件名字
     */
    const onHandleCopyName = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        try {
            clipboard.writeText(extInfo.name);
            toast('Copy Name Success', {
                description: extInfo.name,
                duration: 2000,
            });
        } catch (error) {
            toast.error('Copy Name Fail', {
                duration: 2000,
            });
        }

    };

    /**
     * 复制插件名字
     */
    const onHandleCopyPluginId = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        try {
            clipboard.writeText(extInfo.id);
            toast('Copy Plugin ID Success', {
                description: extInfo.id,
                duration: 2000,
            });
        } catch (error) {
            toast.error('Copy Plugin ID Fail', {
                duration: 2000,
            });
        }
    };

    /**
     * 禁用、启用插件
     * @param status
     */
    const onHanldePulginStatus = async (extId, status) => {
        const extInfo = getExtensionDeatilById(extId);
        await handlePluginStatus(extInfo.id, status);
        getExtensionDatas();
        toast(status ? 'Enable Plugin Success' : 'Disable Plugin Success',{
            duration: 1000,
        });
        setTimeout(() => {
        window.location.reload();
        },1000);
    };

    /**
     * 执行一次禁用、启用插件模拟刷新插件(开发状态)
     */
    const onHandleReloadPlugin = async (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        // if (extInfo.installType === 'development') {
        //
        // } else {
        //     toast('It is not Development');
        // }
        // 先禁用 再启用
        footerTip('loading', 'Reloading Plugin', 3000);
        await handlePluginStatus(extInfo.id, false);
        setTimeout(async () => {
            await handlePluginStatus(extInfo.id, true);
            getExtensionDatas();
            footerTip('success', 'Reload Plugin Success', 1000);
        }, 1000);
    };

    /**
     * 打开插件文件夹路径
     */
    const onHandleShowInFinder = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        const { id, name } = extInfo;
        axios.post(`${ExtShootSeverHost}/open-extension`, {
            extId: id,
            name: encodeURIComponent(name),
        })
            .then(response => {
                console.log(response.data);
                toast('Open Plugin Folder Success', {
                    duration: 2000,
                });
            })
            .catch(error => {
                console.error(error);
                toast('Need Start Local Server', {
                    description: 'npx extss start',
                    action: {
                        label: 'Copy',
                        onClick: () => {
                            navigator.clipboard.writeText('npx extss start');
                        },
                    },
                    duration: 8000,
                    closeButton: true,
                });
            });

    };

    // 激活插件 /activeExtention name
    const onHandleActiveExtension = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        const { extId: id, name, enabled } = extInfo;
        if (!enabled) {
            // 激活插件前，先启用插件
            onHanldePulginStatus(extId, true);
            // 刷新当前网页 才能注入插件
            window.location.reload();
        }
        axios.post(`${ExtShootSeverHost}/active-extension`, {
            extId: id,
            name: name,
        })
            .then(response => {
                console.log(response.data);
                toast('Active Plugin Success', {
                    duration: 2000,
                });
            })
            .catch(error => {
                console.error(error);
                toast('Need Start Local Server', {
                    description: 'npx extss start',
                    action: {
                        label: 'Copy',
                        onClick: () => {
                            navigator.clipboard.writeText('npx extss start');
                        },
                    },
                    duration: 8000,
                    closeButton: true,
                });
            });
    };


    /**
     * 卸载
     */
    const onHanldeUninstallPulgin = async (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        const [, status] = await handleUninstallPlugin(extInfo.id);
        status && await getExtensionDatas();
    };

    /**
     * 打开插件在 web store
     */
    const onHanldeOpenInWebStore = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        const { id } = extInfo;
        const isDev = extId.match(/^(.*?)@_/);
        if (isDev && isDev[1] === 'development') {
            // 一般不会进入这个逻辑，dev的插件不会有显示操作
            footerTip('error', 'Development mode: Store access disabled', 2000);
        } else {
            window.open(`https://chrome.google.com/webstore/detail/${id}`);
        }
    };

    /**
     * solo run mode
     */
    const onHandleSoloRun = async (itemId) => {
        const extInfo = getExtensionDeatilById(itemId);
        console.log(extInfo, 'extInfo');
        await handleSoloRun(extInfo.id);
        getExtensionDatas();
        footerTip('success', 'Check Solo Mode Successfully', 2000);

    };

    /**
     * 排除部分record 不记录recent
     * @param command
     * @returns
     */
    const excludeRecordCommand = (command) => {
        return !['open_snapshot_dialog', 'open_snapshot_dialog', 'add_to_favorites', 'uninstall_plugin'].includes(command);
    };


    const closeLauncher = () => {
        eventBus.emit('closeLauncher');
    };
    /**
     *  处理sub command 事件
     * @param subValue 事件名称
     * @param extId 插件id、command分组的事件名称
     * @param reucently 操作记录数据
     * @returns
     */
    const onClickSubItem = (subValue, extId) => {
        console.log('onClickSubItem ---', subValue, extId);

        if (acMap[subValue] && excludeRecordCommand(subValue)) {
            handleAddRecently({
                value: subValue,
                extIds: [getExtId(extId)],
                isCommand: false,
                name: `${acMap[subValue].name}`,
            });
        }
        const extId_ = getExtId(extId);
        console.log(extId_);
        const extInfo = getExtensionDeatilById(extId_);

        if (!extInfo) {
            return;
        }

        switch (subValue) {
            case 'execute_recent_action':
                onBottomOpenExtPage(extId_);
                closeLauncher();
                break;
            case 'copy_plugin_name':
                onHandleCopyName(extId_);
                closeLauncher();
                break;
            case 'copy_plugin_id':
                onHandleCopyPluginId(extId_);
                closeLauncher();
                break;
            case 'add_to_favorites':
                onHandelFavorite(extId_);
                break;
            case 'disable_plugin':
                onHanldePulginStatus(extId_, false);
                break;
            case 'enable_plugin':
                onHanldePulginStatus(extId_, true);
                break;
            case 'reload_plugin':
                onHandleReloadPlugin(extId_);
                break;
            case 'show_in_finder':
                onHandleShowInFinder(extId_);
                closeLauncher();
                break;
            case 'active_plugin':
                onHandleActiveExtension(extId_);
                closeLauncher();
                break;
            case 'uninstall_plugin':
                onHanldeUninstallPulgin(extId_);
                break;
            case 'open_in_web_store':
                onHanldeOpenInWebStore(extId);
                closeLauncher();
                break;
            case 'open_detail_page':
                handleDoExtDetail(extInfo);
                closeLauncher();
                break;
            case 'solo_run_extension':
                onHandleSoloRun(extId);
                break;
            default:
                break;
        }
    };

    /**
     * command 分组的事件、 同时也是 单个item的选中、回车事件(正常事件)
     * @param item
     */
    const onCommandHandle = async (item, isCommand = false) => {
        const { handle, refresh, name, value } = item;
        console.log('onCommandHandle---', item, typeof handle === 'function');

        if (value === 'add_snapshot') {
            setSnapshotOpen(v => !v);
            handleAddRecently({
                value,
                extIds: [value],
                isCommand: true,
                name,
            });
            return;
        }

        if (typeof handle === 'function') {
            if (value !== 'clear_recently') {
                handleAddRecently({
                    value,
                    extIds: [value, selectSnapId],
                    isCommand: isCommand,
                    name,
                });
            }
            const fsnap = snapshots.find(({ id }) => id === selectSnapId);
            const extDatas = getMutliLevelProperty(fsnap, 'extIds', []);
            await handle({
                extDatas: extDatas,
                snapType: selectSnapId,
            });
            refresh && getExtensionDatas();
        } else {
            handleDoExtDetail(item);
        }
    };

    /**
     * 1.处理 item事件(打开插件详情页)
     * @param extInfo
     * @returns
     */
    const handleDoExtDetail = (extInfo) => {
        const { id } = extInfo;
        const extId = getExtId(id);
        handleOpenExtensionDetails(extId, getExtensionDeatilById(extId)?.name);
    };

    const getSubCnmandItem = (value) => {
        if (value.includes(RecentlyFix)) {
            const recentlys = getMutliLevelProperty(extDatas, '0.children', []);
            return recentlys.find(({ id }) => id === value);
        } else {
            return getExtensionDeatilById(value);
        }
    };
    /**
     *  获取单个数据详情（list 列表下查找）
     */
    const getItemByCommandList = (inValue) => {
        let curenValue = getSubCnmandItem(inValue);
        let isCommand = false;
        if (!curenValue) {
            curenValue = CommandMeta.find(({ value }) => value === inValue);
            isCommand = true;
        }
        return [curenValue, isCommand];
    };

    /**
     *
     * @param  处理历史记录
     * @returns
     */
    const handleRecentEvent = (inValue) => {
        const [curenValue, isCommand] = getItemByCommandList(inValue);
        const { value, pendingUrl, extIds, name } = curenValue || {};
        console.log('RecentlyFix---', inValue, curenValue, isCommand);
        if (value.includes(SearchFix)) {
            window.open(extIds[0]);
            handleAddRecently({
                ...curenValue,
                name: curenValue?.name.split(':')[0],
            });
            return;
        }
        if (value === 'add_snapshot') {
            setSnapshotOpen(v => !v);
            handleAddRecently({
                value,
                extIds: [value],
                isCommand: true,
                name,
            });
            return;
        }
        if (commandMetaMap[value] && typeof commandMetaMap[value].handle === 'function') {
            if (value !== 'clear_recently') {
                handleAddRecently({
                    ...curenValue,
                    value: value,
                    isCommand: true,
                    name: `${commandMetaMap[value].name}`,
                });
            }
            const snapType = extIds[1] || '';
            const fsnap = snapshots.find(({ id }) => id === snapType);
            const extDatas = getMutliLevelProperty(fsnap, 'extIds', []);
            commandMetaMap[value].handle({
                extDatas,
                snapType,
            });
            commandMetaMap[value].refresh && getExtensionDatas();
            return;
        }
        switch (value) {
            case 'open_ext_detail':
            case 'recently_used':
                handleOpenRecently(pendingUrl);
                handleAddRecently({
                    ...curenValue,
                    name: ['recently_used'].includes(value) ? '' : curenValue?.name.split(':')[0],
                });
                break;
            default:
                onClickSubItem(value, getMutliLevelProperty(extIds, '0', ''));
                break;
        }

    };

    /** 兼容 回车事件、sub command action事件  */
    const handelPatibleSubCommand = (subcommand, value) => {
        if (subcommand === 'execute_recent_action' || subcommand === 'execute_command') {
            onBottomOpenExtPage(value);
        } else {
            onClickSubItem(subcommand, value);
        }
    };
    // filter sub command
    // return  action name list
    const getCommandsByType = (value) => {
        const commandMetaItem = CommandMeta.find(action => action?.value === value);
        if (commandMetaItem) {
            return Object.keys(acMap_command);
        }

        const { installType, enabled, isCommand, isSelf } = getSubCnmandItem(value) || {};

        if (isCommand) {
            return ['execute_command'];
        } else if (value.includes(SearchFix)) {
            return ['execute_recent_action'];
        }

        const actionKeys = Object.keys(acMap_Extension()).filter(key => {
            if (isSelf) {
                return !['enable_plugin', 'disable_plugin', 'uninstall_plugin'].includes(key);
            }
            return true;
        });
        const filterDisabledOrEnabledPlugin = (item) => item !== (enabled ? 'enable_plugin' : 'disable_plugin');

        if (installType !== 'development') {
            return actionKeys.filter(filterDisabledOrEnabledPlugin);
        }

        // For development mode plugins, exclude 'open_in_web_store'
        return actionKeys.filter(item => item !== 'open_in_web_store' && filterDisabledOrEnabledPlugin(item));
    };

    /**
     * 排除最近使用、dev、favorite
     */
    const onCommandFilter = (value, search, keywords) => {
        if (!search) return 1;
        if (value.includes('recently_')
            || value.includes('development@_')
            || value.includes('favorite@_')) return 0;
        if (value.includes('search_')) {
            return value.includes(`search_${search}`);
        }
        const fdn = keywords.find((item) => item.toLocaleLowerCase().includes(search?.toLocaleLowerCase()));
        // if (value.includes(search)) return 1;
        return fdn ? 1 : 0;
    };


    /** 底部  Open Extension Page 按钮点击事件、 回车事件处理 */
    const onBottomOpenExtPage = (value) => {
       

        if (value.includes(RecentlyFix)) {
            // 处理记录数据
            handleRecentEvent(value);
        } else {
            const [curenValue, isCommand] = getItemByCommandList(value);
            onCommandHandle(curenValue, isCommand);
            // 只有不是命令时，关闭launcher
            (!isCommand && closeLauncher());
        }
       
    };
    return (
        <div className="ext-shoot" ref={extShootRef}>
            <Command value={value} onValueChange={(v) => setValue(v)}
                filter={onCommandFilter}>
                <div cmdk-raycast-top-shine="" />
                <div className='flex items-center justify-start'>
                   <SearchComponent inputRef={inputRef}/>
                    {

                        // 只有数量大于1时，才显示快照选择
                        snapshots.length > 0 &&
                        <div style={{
                            flexShrink: 0,
                            marginLeft: '12px',
                            position: 'relative',
                            zIndex: 999,
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <SnapshotCommand value={selectSnapId} inputRef={inputRef}
                                listRef={listRef} datas={[{
                                    id: 'all',
                                    name: 'All',
                                }, ...snapshots]} onChange={setSelectSnapId}
                                extShootRef={extShootRef}></SnapshotCommand>
                        </div>
                    }
                </div>
                <hr cmdk-raycast-loader="" />
                <div className='min-h-[380px]'>
                {  <Command.List ref={listRef} hidden={inAppMode}>
                    <Command.Empty> No results found. </Command.Empty>
                    {
                        extDatas.length > 0 ? extDatas?.map(({ children, name }) => {
                            return <>
                                {
                                    children && children.length > 0 ? <>
                                        <Command.Group
                                            heading={`${name}(${children.length})`}>
                                            {children?.map((item) => {
                                                const {
                                                    id,
                                                    name,
                                                    icon,
                                                    enabled,
                                                    isCommand,
                                                    actIcon,
                                                } = item;
                                                return (
                                                    <Item value={id}
                                                        key={id}
                                                        keywords={[...name.split(' '), name]}

                                                        commandHandle={() => handelPatibleSubCommand('execute_recent_action', id)}
                                                        isCommand={isCommand}
                                                        cls={!enabled && 'grayscale'}>
                                                        {icon ? (
                                                            isCommand ? icon :
                                                                <ExtensionIcon
                                                                    base64={icon} />
                                                        ) : (
                                                            <ShootIcon></ShootIcon>
                                                        )}
                                                        <div className="truncate">
                                                            {name}
                                                        </div>
                                                        <div>
                                                            {actIcon ? actIcon : null}
                                                        </div>
                                                    </Item>
                                                );
                                            })
                                            }
                                        </Command.Group>
                                    </>
                                        : null
                                }
                            </>;
                        }) : null
                    }
                    {
                        loaded ?
                            <Command.Group heading="Commands">
                                {CommandMeta.map((item) => {
                                    const {
                                        value,
                                        keywords,
                                        icon,
                                        name,
                                    } = item;
                                    return (
                                        <Item
                                            key={value}
                                            isCommand
                                            value={value}
                                            keywords={keywords}
                                            commandHandle={() => onCommandHandle(item, true)}>
                                            <Logo>{icon}</Logo>
                                            {name}
                                        </Item>
                                    );
                                })}
                            </Command.Group>
                            : null
                    }
                    {
                        // use search word use ...                        
                        search ? <Search search={search}
                            ></Search> : null
                    }
                </Command.List> 
                }

                </div>
               
                <div cmdk-raycast-footer="">

                    <FooterTip />
                    <hr />

                    <button cmdk-raycast-open-trigger=""
                        onClick={() => {
                            onBottomOpenExtPage(value);
                        }}>
                        Execute Recent Action
                        <kbd>↵</kbd>
                    </button>

                    <hr />

                    <SubCommand
                        subCommands={subCommands}
                        listRef={listRef}
                        selectName={getItemByCommandList(value)[0]?.name}
                        value={getItemByCommandList(value)[0]}
                        inputRef={inputRef}
                        extShootRef={extShootRef}
                        includeCommands={getCommandsByType(value)}
                        onClickItem={(subcommand) => {
                            handelPatibleSubCommand(subcommand, value);
                        }}
                    />
                </div>
            </Command>
            <SnapshotDialog listRef={listRef} snapOpen={snapshotOpen}
                snapshots={snapshots}
                onSnapChange={setSnapshotOpen} container={container}
                onSvaeSnap={onSvaeSnap}></SnapshotDialog>
            <div className="container-root" ref={setContainer}></div>
        </div>
    );
}
