/* eslint-disable react/no-unknown-property */

import {MagnifyingGlassIcon} from '@radix-ui/react-icons';

// import * as Select from '@radix-ui/react-select';
import axios from 'axios';

import * as clipboard from 'clipboard-polyfill';
import {Command} from 'cmdk';
import React, {useEffect, useState} from 'react';
import {toast} from 'sonner/dist';
import {AC_ICON_UPDATED} from '~config/actions';
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
    handleUninstallPlugin,
} from '~utils/management';

import {ExtensionIcon, Logo, ShootIcon} from '../icons';
import {deepCopyByJson, getMutliLevelProperty} from '~utils/util';
import Item from './item';
import SubCommand from './sub-command';
import SnapshotDialog from './snapshot-dialog';
import {ExtItem} from '~utils/ext.interface';
import FooterTip, {footerTip} from '~component/cmdk/footer-tip';
import Search from './search-store';
import {SearchFix} from '~config/config';
import SnapshotCommand from './snapshot-command';
import {getSelectSnapId, setSelectSnapIdBtStorge} from '~utils/local.storage';


const RecentlyFix = 'recently_';
const MarkId = '@_';
const acMap = getAllActionMap();
const acMap_command = getSubCommandActionMap();
const acMap_Extension = getSubExtensionActionMap;
const commandMetaMap = getCommandMetaMap();

const getExtId = (id) => {
    const ids = id?.split(MarkId);
    return ids[ids.length - 1];
};

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
    const [search, setSearch] = useState(null);
    const [container, setContainer] = React.useState(null);
    const [snapshotOpen, setSnapshotOpen] = React.useState(false);
    const [recentlys, setRecentlys] = React.useState([]);
    const storeSearchRef = React.useRef(null);
    const extShootRef = React.useRef(null);
    // const inputRef = React.useRef<HTMLInputElement | null>(null)
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
                    id: `${ groups[1].key }${ MarkId }${ item.id }`,
                });
            }
            if (installType === 'development') {
                groups[2].children.push({
                    ...item,
                    id: `${ groups[2].key }${ MarkId }${ item.id }`,
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
                    item.name = `${ extMapping[extIds[0]].name }` || '';
                    item.icon = extMapping[extIds[0]].icon;
                    item.actIcon = acMap[value]?.icon;
                } else if (extIds && extIds.length > 0 && commandMetaMap[extIds[0]]) {
                    item.status = true;
                    item.icon = commandMetaMap[value]?.icon;
                    console.log('extIds---', extIds, extIds[1], value);
                    if (extIds[1] && ['enable_all_extension', 'disable_all_extension'].includes(value)) {
                        if (extIds[1] === 'all') {
                            item.name = `${ commandMetaMap[value].name }[All]`;
                        } else {
                            const fsnap = shotDatas.find(({ id }) => id === extIds[1]);
                            if (fsnap) {
                                item.name = `${ commandMetaMap[value].name }[${ fsnap.name }]`;
                            }
                        }
                    }
                }
                return item;
            }).filter(({ status }) => status);
            nwRecentlys = nwRecentlys.sort((a, b) => b?.time - a?.time).slice(0, 7);
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
                // toast('Extension Update Success');
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

        function inputListener(event) {
            if ([27, 37, 38, 39, 40, 13].includes(event.keyCode)
                || (event.metaKey && event.key.toLocaleUpperCase() === 'K')) return;
            if (event.metaKey) return;
            // 阻止事件冒泡
            event.stopPropagation();
        }

        if (inputRef && inputRef.current) {
            inputRef?.current.addEventListener('keydown', inputListener);
        }
        return () => {
            if (inputRef?.current) {
                inputRef?.current.removeEventListener('keydown', inputListener);
            }
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
        toast('Favorite Success');
    };

    /**
     * 复制插件名字
     */
    const onHandleCopyName = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        try {
            clipboard.writeText(extInfo.name);
            toast('Copy Name Success');
        } catch (error) {
            toast('Copy Name Fail');
        }

    };

    /**
     * 复制插件名字
     */
    const onHandleCopyPluginId = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        try {
            clipboard.writeText(extInfo.id);
            toast('Copy Plugin ID Success');
        } catch (error) {
            toast('Copy Plugin ID Fail');
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
        toast(status ? 'Enable Plugin Success' : 'Disable Plugin Success');
    };

    /**
     * 执行一次禁用、启用插件模拟刷新插件(开发状态)
     */
    const onHandleReloadPlugin = async (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        if (extInfo.installType === 'development') {
            await handlePluginStatus(extInfo.id, false);
            setTimeout(async () => {
                await handlePluginStatus(extInfo.id, true);
                getExtensionDatas();
                toast('Reload PluginSuccess');
            }, 2000);
        } else {
            toast('It is not Development');
        }
    };

    /**
     * 打开插件文件夹路径
     */
    const onHandleShowInFinder = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        const { id, name } = extInfo;
        axios.post('http://localhost:5698/submit', {
            extId: id,
            name: encodeURIComponent(name),
        })
            .then(response => {
                console.log(response.data);
                toast('Show In Finder PluginSuccess');
            })
            .catch(error => {
                console.error(error);
                toast(<span>Show In Finder Error, <a style={ { color: '#1978FF' } }
                                                     target="_blank"
                                                     href="https://github.com/WtecHtec/ext-shoot/blob/main/README.md"
                                                     rel="noreferrer"> View more help </a></span>);
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
     * 排除部分record
     * @param command
     * @returns
     */
    const excludeRecordCommand = (command) => {
        return !['open_snapshot_dialog', 'open_snapshot_dialog', 'add_to_favorites', 'uninstall_plugin'].includes(command);
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
        const extInfo = getExtensionDeatilById(extId);

        if (acMap[subValue] && excludeRecordCommand(subValue)) {
            handleAddRecently({
                value: subValue,
                extIds: [getExtId(extId)],
                isCommand: false,
                name: `${ acMap[subValue].name }`,
            });
        }
        if (!extInfo) {
            return;
        }
        switch (subValue) {
            case 'open_extension_page':
                onBottomOpenExtPage(extId);
                break;
            case 'copy_plugin_name':
                onHandleCopyName(extId);
                break;
            case 'copy_plugin_id':
                onHandleCopyPluginId(extId);
                break;
            case 'add_to_favorites':
                onHandelFavorite(extId);
                break;
            case 'disable_plugin':
                onHanldePulginStatus(extId, false);
                break;
            case 'enable_plugin':
                onHanldePulginStatus(extId, true);
                break;
            case 'reload_plugin':
                onHandleReloadPlugin(extId);
                break;
            case 'show_in_finder':
                onHandleShowInFinder(extId);
                break;
            case 'uninstall_plugin':
                onHanldeUninstallPulgin(extId);
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
                    name: `${ commandMetaMap[value].name }`,
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
        if (subcommand === 'open_extension_page'|| subcommand === 'execute_command') {
            onBottomOpenExtPage(value);
        } else {
            onClickSubItem(subcommand, value);
        }
    };
    // filter sub command
    // return  action name list
    const getCommandsByType = (value) => {
        // console.log('getCommandsByType value---', value);
        // console.log('getCommandsByType detail', getSubCnmandItem(value));
        if (CommandMeta.find((action) => action?.value === value)) {
            return Object.keys(acMap_command);
        }
        // find extension detail
        const { installType, enabled } = getSubCnmandItem(value) || {};
        const acKeys = Object.keys(acMap_Extension());
        if (value.includes(RecentlyFix) || value.includes(SearchFix)) {
            return ['open_extension_page', 'open_snapshot_dialog'];
        }
        if (installType !== 'development') {
            return acKeys.filter(item => !['reload_plugin', enabled ? 'enable_plugin' : 'disable_plugin'].includes(item));
        }
        return [...acKeys].filter(item => {
            return item !== (enabled ? 'enable_plugin' : 'disable_plugin');
        });
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
            return value.includes(`search_${ search }`);
        }
        const fdn = keywords.find((item) => item.toLocaleLowerCase().includes(search?.toLocaleLowerCase()));
        // if (value.includes(search)) return 1;
        return fdn ? 1 : 0;
    };


    /** 底部  Open Extension Page 按钮点击事件、 回车事件处理 */
    const onBottomOpenExtPage = (value) => {
        if (value.includes(SearchFix) && storeSearchRef && storeSearchRef.current) {
            storeSearchRef.current.onSearch();
        } else {
            if (value.includes(RecentlyFix)) {
                // 处理记录数据
                handleRecentEvent(value);
            } else {
                const [curenValue, isCommand] = getItemByCommandList(value);
                onCommandHandle(curenValue, isCommand);
            }
        }
    };
    return (
        <div className="ext-shoot" ref={ extShootRef }>
            <Command value={ value } onValueChange={ (v) => setValue(v) }
                     filter={ onCommandFilter }>
                <div cmdk-raycast-top-shine=""/>
                <div style={ { display: 'flex' } }>
                    <Command.Input
                        value={ search }
                        onValueChange={ setSearch }
                        ref={ inputRef }
                        autoFocus
                        placeholder="Search for extensions and commands..."
                        style={ { flex: 1 } }
                        tabIndex={ -2 }
                    />
                    {

                        // 只有数量大于1时，才显示快照选择
                        snapshots.length > 0 &&
                        <div style={ {
                            flexShrink: 0,
                            marginLeft: '12px',
                            position: 'relative',
                            zIndex: 999,
                            display: 'flex',
                            alignItems: 'center',
                        } }>
                            <SnapshotCommand value={ selectSnapId } inputRef={ inputRef }
                                             listRef={ listRef } datas={ [{
                                id: 'all',
                                name: 'All',
                            }, ...snapshots] } onChange={ setSelectSnapId }
                                             extShootRef={ extShootRef }></SnapshotCommand>
                        </div>
                    }
                </div>

                <hr cmdk-raycast-loader=""/>
                <Command.List ref={ listRef }>
                    <Command.Empty>No results found.</Command.Empty>
                    {
                        search ? <Search search={ search }
                                         ref={ storeSearchRef }></Search> : null
                    }
                    {
                        extDatas.length > 0 ? extDatas?.map(({ children, name }) => {
                            return <>
                                {
                                    children && children.length > 0 ? <>
                                            <Command.Group
                                                heading={ `${ name }(${ children.length })` }>
                                                { children?.map((item) => {
                                                    const {
                                                        id,
                                                        name,
                                                        icon,
                                                        enabled,
                                                        isCommand,
                                                        actIcon,
                                                    } = item;
                                                    return (
                                                        <Item value={ id }
                                                              key={ id }
                                                              keywords={ [...name.split(' '), name] }

                                                              commandHandle={ () => handelPatibleSubCommand('open_extension_page', id) }
                                                              isCommand={ isCommand }
                                                              cls={ !enabled && 'grayscale' }>
                                                            { icon ? (
                                                                isCommand ? icon :
                                                                    <ExtensionIcon
                                                                        base64={ icon }/>
                                                            ) : (
                                                                <ShootIcon></ShootIcon>
                                                            ) }
                                                            <div className="truncate">
                                                                { name }
                                                            </div>
                                                            <div>
                                                                { actIcon ? actIcon : null }
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
                                { CommandMeta.map((item) => {
                                    const {
                                        value,
                                        keywords,
                                        icon,
                                        name,
                                    } = item;
                                    return (
                                        <Item
                                            key={ value }
                                            isCommand
                                            value={ value }
                                            keywords={ keywords }
                                            commandHandle={ () => onCommandHandle(item, true) }>
                                            <Logo>{ icon }</Logo>
                                            { name }
                                        </Item>
                                    );
                                }) }
                            </Command.Group>
                            : null
                    }
                </Command.List>

                <div cmdk-raycast-footer="">

                    <FooterTip/>
                    <hr/>

                    <button cmdk-raycast-open-trigger=""
                            onClick={ () => {
                                onBottomOpenExtPage(value);
                            } }>
                        Open Extension Page
                        <kbd>↵</kbd>
                    </button>

                    <hr/>

                    <SubCommand
                        subCommands={ subCommands }
                        listRef={ listRef }
                        selectName={ getSubCnmandItem(value)?.name }
                        inputRef={ inputRef }
                        extShootRef={ extShootRef }
                        includeCommands={ getCommandsByType(value) }
                        onClickItem={ (subcommand) => {
                            handelPatibleSubCommand(subcommand, value);
                        } }
                    />
                </div>
            </Command>
            <SnapshotDialog listRef={ listRef } snapOpen={ snapshotOpen }
                            snapshots={ snapshots }
                            onSnapChange={ setSnapshotOpen } container={ container }
                            onSvaeSnap={ onSvaeSnap }></SnapshotDialog>
            <div className="container-root" ref={ setContainer }></div>
        </div>
    );
}
