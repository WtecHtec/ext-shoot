import {  getIcon } from './utils/util'

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)
interface ExtItem {
  id: string
  name: string,
  icon: string | ArrayBuffer,
  description: string
}

/**
 * 获取插件列表
 * @param param0
 */
const getExtensions = ({ sendResponse }) => {
  chrome.management.getAll().then(async (extensions) => {
    const result: ExtItem[] = []
    for (let i = 0; i < extensions.length; i ++) {
      const { id , name, description, icons } = extensions[i]
      const icon =  getIcon(icons)
      result.push({
        id,
        name,
        description,
        icon,
      })
    }
    sendResponse({ extensions: result });
  });
}

/**
 * 激活插件状态
 * @param param0 
 */
const handleEnableExtension = ( { request, sendResponse, } ) => {
  const { extensionId, status } = request
  chrome.management.setEnabled(extensionId, status, () => {
    sendResponse({ status: "Extension enabled" });
  });
}

/**
 * 卸载插件
 * @param param0 
 */
const handleUninstallExtension = ({ request, sendResponse, }) => {
  const { extensionId } = request
  chrome.management.uninstall(extensionId, {}, () => {
    sendResponse({ status: "Extension uninstalled" });
  });
}

/**
 * 打开插件设置
 * @param param0
 */
const handleOpenOptionsPage =  ({ request, sendResponse, }) => {
  const { extensionId } = request
  chrome.management.get(extensionId, (extensionInfo) => {
    if (extensionInfo.optionsUrl) {
      chrome.tabs.create({ url: extensionInfo.optionsUrl });
      sendResponse({ status: "Options page opened" });
    } else {
      sendResponse({ status: "No options page available" });
    }
  });
}

/**
 * 插件详情
 * @param param0 
 */
const handleOpenExtensionDetails = ({ request, sendResponse, }) => {
  const { extensionId } = request
  const detailsUrl = `chrome://extensions/?id=${extensionId}`;
  chrome.tabs.create({ url: detailsUrl });
  sendResponse({ status: "Extension details page opened" });
}

const ACTICON_MAP = {
  'get_extensions': getExtensions,
  'enable_extension': handleEnableExtension,
  'uninstall_extension': handleUninstallExtension,
  'open_options_page': handleOpenOptionsPage,
  'open_extension_details': handleOpenExtensionDetails,
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 获取插件列表
  const { action } = request
  if (typeof ACTICON_MAP[action] === 'function') {
    ACTICON_MAP[action]({request, sender, sendResponse })
  }
  return true; // 表示我们将异步发送响应
});