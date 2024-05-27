import axios from 'axios';
import * as clipboard from 'clipboard-polyfill';
import { toast } from 'sonner/dist';

import { footerTip } from '~component/cmdk/tip/tip-ui';
import { ExtShootSeverHost } from '~config/config';
import {
  handleOpenExtensionDetails,
  handlePluginStatus,
  handleSoloRun,
  handleUninstallPlugin
} from '~utils/management';

/**
 * 禁用、启用插件
 * @param status
 */
export const onHanldePulginStatus = async ({ id, status }) => {
  await handlePluginStatus(id, status);
  // getExtensionDatas();
  toast(status ? 'Enable Plugin Success' : 'Disable Plugin Success', {
    duration: 1000
  });
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

// 激活插件 /activeExtention name
export const onHandleActiveExtension = ({ id, name, enabled }: { id: string; name: string; enabled: boolean }) => {
  if (!enabled) {
    // 激活插件前，先启用插件
    onHanldePulginStatus({ id, status: true });
    // 刷新当前网页 才能注入插件
    window.location.reload();
  }
  axios
    .post(`${ExtShootSeverHost}/active-extension`, {
      extId: id,
      name: name
    })
    .then((response) => {
      console.log(response.data);
      toast('Active Plugin Success', {
        duration: 2000
      });
    })
    .catch((error) => {
      console.error(error);
      toast('Need Start Local Server', {
        description: 'npx extss start',
        action: {
          label: 'Copy',
          onClick: () => {
            navigator.clipboard.writeText('npx extss start');
          }
        },
        duration: 8000,
        closeButton: true
      });
    });
};

/**
 * 打开插件文件夹路径
 */
export const onHandleShowInFinder = ({ id, name }) => {
  axios
    .post(`${ExtShootSeverHost}/open-extension`, {
      extId: id,
      name: encodeURIComponent(name)
    })
    .then((response) => {
      console.log(response.data);
      toast('Open Plugin Folder Success', {
        duration: 2000
      });
    })
    .catch((error) => {
      console.error(error);
      toast('Need Start Local Server', {
        description: 'npx extss start',
        action: {
          label: 'Copy',
          onClick: () => {
            navigator.clipboard.writeText('npx extss start');
          }
        },
        duration: 8000,
        closeButton: true
      });
    });
};

/**
 * 复制插件名字
 */
export const onHandleCopyName = ({ name }) => {
  try {
    clipboard.writeText(name);
    toast('Copy Name Success', {
      description: name,
      duration: 2000
    });
  } catch (error) {
    toast.error('Copy Name Fail', {
      duration: 2000
    });
  }
};

/**
 * 复制插件ID
 */
export const onHandleCopyPluginId = ({ id }) => {
  try {
    clipboard.writeText(id);
    toast('Copy Plugin ID Success', {
      description: id,
      duration: 2000
    });
  } catch (error) {
    toast.error('Copy Plugin ID Fail', {
      duration: 2000
    });
  }
};

/**
 * 在 Web Store 打开插件
 * @param extId - 插件 ID
 */
export const onHanldeOpenInWebStore = ({ id }) => {
  window.open(`https://chrome.google.com/webstore/detail/${id}`);
};

/**
 * 执行一次禁用、启用插件模拟刷新插件(开发状态)
 */
export const onHandleReloadPlugin = async ({ id }) => {
  footerTip('loading', 'Reloading Plugin', 3000);
  await handlePluginStatus(id, false);
  setTimeout(async () => {
    await handlePluginStatus(id, true);
    // getExtensionDatas();
    // TODO:WIP: 重新加载插件
    footerTip('success', 'Reload Plugin Success', 1000);
  }, 1000);
};

/**
 * 卸载插件
 */
export const onHanldeUninstallPulgin = async ({ id }) => {
  const [, status] = await handleUninstallPlugin(id);
  // TODO:WIP: 重新加载插件
  // status && (await getExtensionDatas());
  status && footerTip('success', 'Uninstall Plugin Success', 1000);
};

/**
 * 打开插件详情页
 * @param extInfo
 * @returns
 */
export const handleDoExtDetail = async ({ id, name }) => {
  return handleOpenExtensionDetails(id, name);
};

/**
 * solo run mode
 */
export const onHandleSoloRun = async ({ id }) => {
  await handleSoloRun(id);
  footerTip('success', 'Check Solo Mode Successfully', 2000);
};
