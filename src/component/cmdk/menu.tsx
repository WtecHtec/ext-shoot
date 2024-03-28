/* eslint-disable react/no-unknown-property */

import {ChevronDownIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons';

import * as Select from '@radix-ui/react-select';

import axios from 'axios';

import * as clipboard from 'clipboard-polyfill';
import {Command} from 'cmdk';
import React, {useEffect, useState} from 'react';
import {toast} from 'sonner/dist';
import {AC_ICON_UPDATED} from '~config/actions';
import {ActionMeta, getSubItemActionMap, SUB_ITME_ACTIONS} from '~utils/actions';
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
import {getId, getMutliLevelProperty} from '~utils/util';
import Item from './item';
import SelectItem from './select-item';
import SubCommand from './sub-command';
import SnapshotDialog from './snapshot-dialog';
import {ExtItem} from '~utils/ext.interface';
import FooterTip, {footerTip} from '~component/cmdk/footer-tip';
import Search from './search-store';
import {SearchFix} from '~config/config';


const RecentlyFix = 'recently_';
const MarkId = '@_';

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
    const [selectContainer, setSelectContainer] = React.useState(null);
    const [snapshotOpen, setSnapshotOpen] = React.useState(false);
    const [recentlys, setRecentlys] = React.useState([]);
    const storeSearchRef = React.useRef(null);
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
        // console.log('获取插件数据');
        const [err, res] = await getExtensionAll();
        if (err || !Array.isArray(res)) {
            return;
        }
        const shotDatas = await getSnapShotDatas();
        const [, recentlys] = await handleGetRecentlys();
        console.log('recentlys---', recentlys);
        const [groups] = formatExtDatas(res, shotDatas, selectSnapId, recentlys);
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
        const subCommands = [...SUB_ITME_ACTIONS];
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
            const acMap = getSubItemActionMap();
            let nwRecentlys = recentlys.filter(item => item);
            nwRecentlys = nwRecentlys.map((item) => {
                const { extIds, value, isCommand } = item;
                item.status = false;
                item.enabled = true;
                if (value.includes(SearchFix)) {
                    item.status = true;
                    item.icon = <MagnifyingGlassIcon></MagnifyingGlassIcon>;
                } else if (value === 'open_snapshot_dialog') {
                    item.status = true;
                    item.icon = acMap[value]?.icon;
                } else if (extIds && extIds.length === 1 && extMapping[extIds[0]]) {
                    item.status = true;
                    item.enabled = extMapping[extIds[0]].enabled;
                    item.name = `${ item.name }${ value === 'recently_used' ? '' : ':' }${ extMapping[extIds[0]].name }` || '';
                    if (isCommand) {
                        item.icon = acMap[value]?.icon;
                    } else {
                        item.icon = extMapping[extIds[0]].icon;
                    }
                }
                return item;
            }).filter(({ status }) => status);
            nwRecentlys = nwRecentlys.sort((a, b) => b?.time - a?.time).slice(0, 10);
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
            if ([27, 37, 38, 39, 40].includes(event.keyCode)) return;
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
     * 更listener新 改为command
     */
    // const onHandleUpdate = () => {
    //     handleExtUpdateDone();
    //     footerTip('loading', 'Update Extension Info ...');
    //     setHasUpdateStatus(2);
    // };

    /**
     * 回车操作
     * @returns
     */
    const onHandleOpenExt = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        if (!extInfo) {
            toast('It is not Extension');
            return;
        }
        handleDoExt(extInfo);
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
     * 打开插件在 web store
     */
    const onHanldeOpenInWebStore = (extId) => {
        const extInfo = getExtensionDeatilById(extId);
        const { id } = extInfo;
        const isDev = extId.match(/^(.*?)@_/);
        if (isDev && isDev[1] === 'development') {
            toast('Open in Web Store Error');
        } else {
            window.open(`https://chrome.google.com/webstore/detail/${id}`);
        }
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
     *  处理sub command 事件
     * @param subValue 事件名称
     * @param extId 插件id、command分组的事件名称
     * @returns
     */
    const onClickSubItem = (subValue, extId) => {
        console.log('onClickSubItem ---', subValue, extId);
        const acMap = getSubItemActionMap();
        if (acMap[subValue]) {
            handleAddRecently({
                value: subValue,
                extIds: [getExtId(extId)],
                isCommand: true,
                name: `${ acMap[subValue].name }`,
            });
        }

        if (subValue === 'open_snapshot_dialog') {
            setSnapshotOpen(v => !v);
            return;
        }
        const extInfo = getExtensionDeatilById(extId);
        if (!extInfo) {
            // toast('It is not Extension');
            return;
        }
        switch (subValue) {
            case 'open_extension_page':
                onHandleOpenExt(extId);
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
            case 'open_in_web_store':
                onHanldeOpenInWebStore(extId);
                break;
            default:
                break;
        }
    };

    /**
     * command 分组的事件、 同时也是 item的回车事件
     * @param item
     */
    const onCommandHandle = async (item) => {
        const { handle, refresh } = item;
        if (typeof handle === 'function') {
            await handle({
                extDatas: extDatas,
                snapType: selectSnapId,
            });
            refresh && getExtensionDatas();
        } else {
            handleDoExt(item);
        }
    };
    /**
     * 1.处理 item事件(打开插件详情页)
     * 2.处理 常用recently 事件
     * @param extInfo
     * @returns
     */
    const handleDoExt = (extInfo) => {
        const { id, value, pendingUrl, extIds } = extInfo;
        console.log('extInfo---', extInfo);
        if (id.includes(RecentlyFix)) {
            if (value.includes(SearchFix)) {
                window.open(extIds[0]);
                handleAddRecently({
                    ...extInfo,
                    name: extInfo?.name.split(':')[0],
                });
                return;
            }
            switch (value) {
                case 'open_ext_detail':
                case 'recently_used':
                    handleOpenRecently(pendingUrl);
                    handleAddRecently({
                        ...extInfo,
                        name: ['recently_used'].includes(value) ? '' : extInfo?.name.split(':')[0],
                    });
                    break;
                default:
                    onClickSubItem(value, getMutliLevelProperty(extIds, '0', ''));
            }
        } else {
            const extId = getExtId(id);
            handleOpenExtensionDetails(extId, getExtensionDeatilById(extId)?.name);
        }
    };


    const getSubCnmandItem = (value) => {
        if (value.includes(RecentlyFix)) {
            const recentlys = getMutliLevelProperty(extDatas, '0.children', []);
            return recentlys.find(({ id }) => id === value);
        } else {
            return getExtensionDeatilById(value);
        }
    };

    /** 兼容  */
    const handelPatibleSubCommand = (subcommand, value) => {
        const curenValue = getSubCnmandItem(value);
        console.log('subcommand, value---', subcommand, value);
        if (value.includes(RecentlyFix) && !['open_snapshot_dialog'].includes(subcommand)) {
            onCommandHandle(curenValue);
        } else {
            const { handle } = ActionMeta.find((action) => action?.value === value) || {};
            if (typeof handle === 'function') {
                handle({ extDatas: extDatas, snapType: selectSnapId });
                return;
            }
            onClickSubItem(subcommand, value);
        }
    };
    const getCommandsByType = (value) => {
        const acMap = getSubItemActionMap();
        const acKeys = Object.keys(acMap);
        const { installType, enabled } = getSubCnmandItem(value) || {};
        if (value.includes(RecentlyFix) || value.includes(SearchFix) || ActionMeta.find((action) => action?.value === value)) {
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

    /** 底部  Open Extension Page 按钮点击事件 */
    const onBottomOpenExtPage = () => {
        if (value.includes(SearchFix) && storeSearchRef && storeSearchRef.current) {
            storeSearchRef.current.onSearch();
        } else {
            const { handle } = ActionMeta.find((action) => action?.value === value) || {};
            if (typeof handle === 'function') {
                handle({ extDatas: extDatas, snapType: selectSnapId });
                return;
            }
            handelPatibleSubCommand('open_extension_page', value);
        }
    };
    return (
        <div className="ext-shoot">
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
                    <div style={ {
                        flexShrink: 0,
                        marginLeft: '12px',
                        position: 'relative',
                        zIndex: 999,
                    } }>
                        <Select.Root value={ selectSnapId }
                                     onValueChange={ setSelectSnapId }>
                            <Select.Trigger className="SelectTrigger"
                                            aria-label="Food">
                                <Select.Value placeholder="Select a Snapshot"/>
                                <Select.Icon className="SelectIcon">
                                    <ChevronDownIcon/>
                                </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal container={ selectContainer }>
                                <Select.Content className="SelectContent">
                                    <SelectItem value="all">All</SelectItem>
                                    {
                                        snapshots.length > 0 ? snapshots.map(({
                                                                                  id,
                                                                                  name,
                                                                              }) =>
                                            <SelectItem key={ id }
                                                        value={ id || getId() }>{ name }</SelectItem>) : null
                                    }
                                </Select.Content>
                            </Select.Portal>
                        </Select.Root>
                        <div className="container-root menu-main" style={ {
                            width: '100%',
                            boxSizing: 'border-box',
                            position: 'relative',
                        } } ref={ setSelectContainer }></div>
                    </div>
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
                                                    } = item;
                                                    return (
                                                        <Item value={ id }
                                                              key={ id }
                                                              keywords={ [...name.split(' '), name] }

                                                              commandHandle={ () => onCommandHandle(item) }
                                                              isCommand={ isCommand }
                                                              cls={ !enabled && 'grayscale' }>
                                                            { icon ? (
                                                                isCommand ? icon :
                                                                    <ExtensionIcon
                                                                        base64={ icon }/>
                                                            ) : (
                                                                <ShootIcon></ShootIcon>
                                                            ) }
                                                            { name }
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
                                { ActionMeta.map((item) => {
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
                                            commandHandle={ () => onCommandHandle(item) }>
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
                                onBottomOpenExtPage();
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
                        includeCommands={ getCommandsByType(value) }
                        onClickItem={ (subcommand) => {
                            handelPatibleSubCommand(subcommand, value);
                        } }
                        // onClickSubItem(subcommand, value)
                    />
                </div>
            </Command>
            <SnapshotDialog snapOpen={ snapshotOpen } snapshots={ snapshots }
                            onSnapChange={ setSnapshotOpen } container={ container }
                            onSvaeSnap={ onSvaeSnap }></SnapshotDialog>
            <div className="container-root" ref={ setContainer }></div>
        </div>
    );
}
