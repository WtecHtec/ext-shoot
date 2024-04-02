import {Storage} from '@plasmohq/storage';
import {
    EXT_RECENTLY_CACHE,
    EXT_SNAPSHOT_CACHE,
    EXTENDED_INFO_CACHE,
    ICON_CACHE,
} from '~config/cache.config';
import {getId, getMutliLevelProperty} from './util';
import {RecentlyItem} from './ext.interface';
import {SearchFix} from '~config/config';
const storage = new Storage({
    area: 'local',
});

/** 缓存icon */
export const setStorageByIcon = (cacheDatas) => {
    return storage.set(ICON_CACHE, cacheDatas);
};

/** 获取缓存icon */
export const getStorageIcon = () => {
    return storage.get(ICON_CACHE);
};

/** 缓存扩展信息 */
export const setExtendedInfo = async (id, key, value) => {
    const extendInfo = await storage.get(EXTENDED_INFO_CACHE) || {};
    if (!extendInfo[id]) {
        extendInfo[id] = {};
    }
    extendInfo[id][key] = value;
    await storage.set(EXTENDED_INFO_CACHE, extendInfo);
};

/** 获取扩展信息  */
export const getExtendedInfo = () => {
    return storage.get(EXTENDED_INFO_CACHE);
};

/** 生成一个快照
 *
 * [
 *   {
 *    id: string,
 *    name: string,
 *    extids: []
 *  }
 * ]
 *
 */
export const setSnapshot = (snapshots) => {
    return storage.set(EXT_SNAPSHOT_CACHE, snapshots);
};

/** 获取快照数据 */
export const getSnapshots = (): Promise<any[]> => {
    return storage.get(EXT_SNAPSHOT_CACHE);
};

/**
 *
 * @param value
 * @param icon
 * @param extIds
 * @param name
 * @param pendingUrl
 * @param isCommand true | false
 * @returns
 */

export const setRecentlyData = async (param: RecentlyItem) => {
    console.log(param);
    let datas = await storage.get(EXT_RECENTLY_CACHE) as any;
    if (!Array.isArray(datas)) {
        datas = [];
    }
    datas = datas.filter(({ extIds }) => {
        return getMutliLevelProperty(extIds, '0', '') !== getMutliLevelProperty(param, 'extIds.0', '');
    });
    datas = datas.filter(({ value }) => {
        if (getMutliLevelProperty(param, 'value', '').includes(SearchFix)) {
            return !value.includes(SearchFix);
        }
        return true;
    });
    console.log('datas---', datas);
    datas.push({
        ...param,
        id: `recently_${ getId() }`,
        time: new Date().getTime(),
    });

    console.log('datas---', datas);
    return storage.set(EXT_RECENTLY_CACHE, [...datas]);
};

export const clearRecentlyData = () => {
    return storage.set(EXT_RECENTLY_CACHE, []);
}


export const getRecentlyData = () => {
    return storage.get(EXT_RECENTLY_CACHE);
};
