/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable */

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
// import * as Select from '@radix-ui/react-select';
import { Command } from "motion-cmdk";
import React, { useEffect, useState } from "react";

import FooterTip, { footerTip } from "~component/cmdk/tip/tip-ui";
import { AC_ICON_UPDATED } from "~config/actions";
import {
  MarkId,
  RecentlyFix,
  RecentSaveNumber,
  SearchFix
} from "~config/config";
import { getExtId } from "~lib/util";
import {
  CommandMeta,
  getAllActionMap,
  getCommandMetaMap,
  SUB_COMMAND_ACTIONS,
  SUB_EXTENSION_ACTIONS
} from "~utils/actions";
import { eventBus } from "~component/cmdk/panel/event-bus";
import { ExtItem } from "~utils/ext.interface";
import { getSelectSnapId, setSelectSnapIdBtStorge } from "~utils/local.storage";
import {
  getExtensionAll,
  handleAddRecently,
  handleCreateSnapshots,
  handleExtFavoriteDone,
  handleGetAllCommands,
  handleGetRecentlys,
  handleGetSnapshots, handleSoloRun
} from "~utils/management";
import { deepCopyByJson, getMutliLevelProperty } from "~utils/util";

import { GlobeIcon } from "../icons";
// import SubCommand from './action/action-ui';
import Action from "./action/action-ui-refactor";
import { appManager } from "./app/app-manager";
import AppUI from "./app/app-ui";
import NotFound from "./common/NotFound";
import { searchManager } from "./search/search-manager";
import SearchComponent from "./search/search-ui";
import SnapshotCommand from "./snapshot-command";
import SnapshotDialog from "./snapshot-dialog";
import { CommandUI } from "./command/command-ui";
import { initEscControl } from "./panel/esc-control";
import { topicManager } from "./topic/topic-manager";


const acMap = getAllActionMap();
// const acMap_command = getSubCommandActionMap()
// const acMap_Extension = getSubExtensionActionMap
const commandMetaMap = getCommandMetaMap();

const BASE_GROUP = () => [
  {
    name: "Recently Accessed",
    key: "recently",
    children: []
  },
  {
    name: "Favorite",
    key: "favorite",
    children: []
  },
  {
    name: "Development",
    key: "development",
    children: []
  }
];

export function MotionShotCMDK() {
  const [value, setValue] = React.useState("");
  const [extDatas, setExtDatas] = React.useState([]); // 页面显示数据
  const [originDatas, setOriginDatas] = React.useState([]); // 扩展源数据, 全部
  const [, setHasUpdateStatus] = React.useState(0); // 0:无更新；1:有更新；2:更新中
  const [selectSnapId, setSelectSnapId] = React.useState("all"); // 快照id
  const [snapshots, setSnapshots] = React.useState([]); // 快照数据
  const [, setSubCommands] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef(null);
  const [search, setSearch] = useState(searchManager.content);

  const [container, setContainer] = React.useState(null);
  const [snapshotOpen, setSnapshotOpen] = React.useState(false);
  const [recentlys, setRecentlys] = React.useState([]);
  const extShootRef = React.useRef(null);

  const [inAppMode, setInAppMode] = React.useState(searchManager.ifInApp); // 是否进入应用

  /**
   * 获取input输入框的值
   */
  useEffect(() => {
    const unsubscribe = searchManager.subscribe(
      ({ search }) => {
        setSearch(search);
      },
      {
        target: ["search"]
      }
    );
    return unsubscribe; // Cleanup on unmount
  }, []);

  useEffect(() => {
    const unsubscribe = appManager.subscribe(({ inAppMode }) => {
      setInAppMode(inAppMode);
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
    console.log("shotDatas---", shotDatas, selectSnapId);
    const fshot = shotDatas.find(({ id }) => id === selectSnapId);
    selectSnapId = fshot ? selectSnapId : "all";
    const [, recentlys] = await handleGetRecentlys();
    console.log("recentlys---", recentlys, selectSnapId);
    const [groups] = formatExtDatas(
      res,
      shotDatas,
      selectSnapId,
      recentlys ?? []
    );
    console.log("groups---", groups);
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
    exts
      .sort((a, b) => b.enabled - a.enabled)
      .forEach((item) => {
        const { installType, favorite, id } = item as ExtItem;
        extMapping[id] = item;
        if (favorite) {
          groups[1].children.push({
            ...item,
            id: `${groups[1].key}${MarkId}${item.id}`
          });
        }
        if (installType === "development") {
          groups[2].children.push({
            ...item,
            id: `${groups[2].key}${MarkId}${item.id}`
          });
        }
        if (
          currentSnap &&
          Array.isArray(currentSnap.extIds) &&
          currentSnap.extIds.includes(item.id)
        ) {
          currExts.push({
            ...item
          });
        }
      });

    if (selectSnapId === "all") {
      groups.push({
        name: "All",
        key: "all",
        children: [...exts]
      });
    } else if (currExts.length && currentSnap) {
      groups.push({
        name: currentSnap.name,
        key: currentSnap.id,
        children: [...currExts]
      });
    }
    if (Array.isArray(recentlys) && recentlys.length) {
      let nwRecentlys = recentlys.filter((item) => item);
      nwRecentlys = nwRecentlys
        .map((item) => {
          const { extIds, value } = item;
          item.status = false;
          item.enabled = true;
          if (value.includes(SearchFix)) {
            item.status = true;
            item.icon = <MagnifyingGlassIcon></MagnifyingGlassIcon>;
          } else if (extIds && extIds.length === 1 && extMapping[extIds[0]]) {
            item.status = true;
            item.enabled = extMapping[extIds[0]].enabled;
            item.name = `${extMapping[extIds[0]].name}` || "";
            item.icon = extMapping[extIds[0]].icon;
            item.actIcon = acMap[value]?.icon || <GlobeIcon></GlobeIcon>;
          } else if (extIds && extIds.length > 0 && commandMetaMap[extIds[0]]) {
            item.status = true;
            item.icon = commandMetaMap[value]?.icon;
            console.log("extIds---", extIds, extIds[1], value);
            if (
              extIds[1] &&
              ["enable_all_extension", "disable_all_extension"].includes(value)
            ) {
              item.actIcon = <GlobeIcon></GlobeIcon>;
              if (extIds[1] === "all") {
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
        })
        .filter(({ status }) => status);
      nwRecentlys = nwRecentlys
        .sort((a, b) => b?.time - a?.time)
        .slice(0, RecentSaveNumber);
      groups[0].children = [...nwRecentlys];
    }
    return [groups];
  };
  /** 触发按键 */
  React.useEffect(() => {
    const handelMsgBybg = (request, sender, sendResponse) => {
      const { action } = request;
      if (action === AC_ICON_UPDATED) {
        // 在这里处理接收到的消息
        setHasUpdateStatus(0);
        getExtensionDatas();
        footerTip("success", "Extension Info Updated Successfully", 3000);
      } else {
        onClickSubItem(action, value);

      }
      // 发送响应
      // sendResponse({ result: "Message processed in content.js" });
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

    return () => {
    };
  }, []);

  // 当快照选择变化时，可以不需要重新请求接口
  useEffect(() => {
    const [groups] = formatExtDatas(
      originDatas,
      snapshots,
      selectSnapId,
      recentlys
    );
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
        ({ enabled }) => enabled === true
      );
      extIds = extIds.map(({ id }) => id);
      await handleCreateSnapshots(snapId, name, extIds);
      if (tab === "add") {
        await getSnapShotDatas();
      } else if (tab === "replace") {
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
    footerTip(
      "success",
      favorite ? "Remove Favorite Success" : "Add Favorite Success",
      2000
    );
  };


  /**
   * solo run mode
   */
  const onHandleSoloRun = async (itemId) => {
    const extInfo = getExtensionDeatilById(itemId);
    console.log(extInfo, "extInfo");
    await handleSoloRun(extInfo.id);
    getExtensionDatas();
    footerTip("success", "Check Solo Mode Successfully", 2000);
  };

  /**
   * 排除部分record 不记录recent
   * @param command
   * @returns
   */
  const excludeRecordCommand = (command) => {
    return ![
      "open_snapshot_dialog",
      "open_snapshot_dialog",
      "add_to_favorites",
      "uninstall_plugin"
    ].includes(command);
  };

  const closeLauncher = () => {
    eventBus.emit("closeLauncher");
  };
  /**
   *  处理sub command 事件
   * @param subValue 事件名称
   * @param extId 插件id、command分组的事件名称
   * @param reucently 操作记录数据
   * @returns
   */
  const onClickSubItem = (subValue, extId) => {
    console.log("onClickSubItem ---", subValue, extId);

    if (acMap[subValue] && excludeRecordCommand(subValue)) {
      handleAddRecently({
        value: subValue,
        extIds: [getExtId(extId)],
        isCommand: false,
        name: `${acMap[subValue].name}`
      });
    }
    const extId_ = getExtId(extId);
    console.log(extId_);
    const extInfo = getExtensionDeatilById(extId_);

    if (!extInfo) {
      return;
    }

    switch (subValue) {
      case "execute_recent_action":
        onBottomOpenExtPage(extId_);
        closeLauncher();
        break;
      case "add_to_favorites":
        onHandelFavorite(extId_);
        break;
      case "solo_run_extension":
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
    console.log("onCommandHandle---", item, typeof handle === "function");

    if (value === "add_snapshot") {
      setSnapshotOpen((v) => !v);
      handleAddRecently({
        value,
        extIds: [value],
        isCommand: true,
        name
      });
      return;
    }

    if (typeof handle === "function") {
      if (value !== "clear_recently") {
        handleAddRecently({
          value,
          extIds: [value, selectSnapId],
          isCommand: isCommand,
          name
        });
      }
      const fsnap = snapshots.find(({ id }) => id === selectSnapId);
      const extDatas = getMutliLevelProperty(fsnap, "extIds", []);
      await handle({
        extDatas: extDatas,
        snapType: selectSnapId
      });
      refresh && getExtensionDatas();
    } else {
      // handleDoExtDetail(item);
    }
  };



  const getSubCnmandItem = (value) => {
    if (value.includes(RecentlyFix)) {
      const recentlys = getMutliLevelProperty(extDatas, "0.children", []);
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



  /** 兼容 回车事件、sub command action事件  */
  const handelPatibleSubCommand = (subcommand, value) => {
    if (
      subcommand === "execute_recent_action" ||
      subcommand === "execute_command"
    ) {
      onBottomOpenExtPage(value);
    } else {
      onClickSubItem(subcommand, value);
    }
  };


  const onCommandFilter = (value, search, keywords) => {
    const topics = topicManager.activeKeywords;

    if (!search && topics) {
      const foundTopic = topics.some(topic => keywords.includes(topic));
      return foundTopic ? 10 : 1;
    }

    if (!search) return 1;

    const found = keywords.find(item => item.toLowerCase().includes(search.toLowerCase()));
    return found ? 1 : 0;
  };


  /** 底部  Open Extension Page 按钮点击事件、 回车事件处理 */
  const onBottomOpenExtPage = (value) => {
    const [curenValue, isCommand] = getItemByCommandList(value);
    onCommandHandle(curenValue, isCommand);
    // 只有不是命令时，关闭launcher
    !isCommand && closeLauncher();
  };

  const handleChangeSelectCmd = (value) => {
    appManager.changeSelectCmd(value);
    setValue(value);
  };

  useEffect(() => {
    initEscControl();
  })

  return (
    <div className="ext-shoot" ref={extShootRef}>
      <Command
        value={value}
        onValueChange={(v) => handleChangeSelectCmd(v)}
        vimBindings={true}
        filter={onCommandFilter}>
        <div cmdk-motionshot-top-shine="" />
        <div className="flex items-center justify-start">
          <SearchComponent inputRef={inputRef} />
          {
            // 只有数量大于1时，才显示快照选择
            snapshots.length > 0 && (
              <div
                style={{
                  flexShrink: 0,
                  marginLeft: "12px",
                  position: "relative",
                  zIndex: 999,
                  display: "flex",
                  alignItems: "center"
                }}>
                <SnapshotCommand
                  value={selectSnapId}
                  inputRef={inputRef}
                  listRef={listRef}
                  datas={[
                    {
                      id: "all",
                      name: "All"
                    },
                    ...snapshots
                  ]}
                  onChange={setSelectSnapId}
                  extShootRef={extShootRef}></SnapshotCommand>
              </div>
            )
          }
        </div>
        <hr cmdk-motionshot-loader="" />
        <>
          {
            <Command.List ref={listRef} hidden={inAppMode}>
              <NotFound.NotFoundWithIcon />
              <CommandUI />
            </Command.List>
          }
          {
            <>
              <AppUI />
            </>
          }
        </>
        <div cmdk-motionshot-footer="">
          <FooterTip />
          <hr />
          <button
            cmdk-motionshot-open-trigger=""
            onClick={() => {
              onBottomOpenExtPage(value);
            }}>
            Execute Recent Action
            <kbd>↵</kbd>
          </button>
          <hr />
          <Action
            listRef={listRef}
            value={getItemByCommandList(value)[0]}
            inputRef={inputRef}
            extShootRef={extShootRef}
          />
        </div>
      </Command>
      <SnapshotDialog
        listRef={listRef}
        snapOpen={snapshotOpen}
        snapshots={snapshots}
        onSnapChange={setSnapshotOpen}
        container={container}
        onSvaeSnap={onSvaeSnap}></SnapshotDialog>
      <div className="container-root" ref={setContainer}></div>
    </div>
  );
}
