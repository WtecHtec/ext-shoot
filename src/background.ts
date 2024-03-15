import { Storage } from "@plasmohq/storage"

import { EXT_UPDATE, EXT_UPDATE_DONE } from "~config/actions"
import { HAS_CRX_UPDATE, ICON_CACHE } from "~config/cache.config"

import { getIcon } from "./utils/util"

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

const storage = new Storage({
  area: "local"
})

// 当插件安装时，开始计时
// dev 先注释掉
chrome.runtime.onInstalled.addListener(() => {
  console.log("installed ---")
  // chrome.tabs.create({
  //   url: chrome.runtime.getURL("/tabs/welcome.html"),
  // });
})
interface ExtItem {
  id: string
  name: string
  icon: string | ArrayBuffer
  description: string
}

/**
 * 获取插件列表
 * @param param0
 */
const getExtensions = ({ sendResponse }) => {
  chrome.management.getAll().then(async (extensions) => {
    const result: ExtItem[] = []
    const iconData = (await storage.get(ICON_CACHE)) || {}
    for (let i = 0; i < extensions.length; i++) {
      const { id, name, description, icons } = extensions[i]
      result.push({
        id,
        name,
        description,
        icon: iconData[id] || ""
      })
    }
    sendResponse({ extensions: result })
  })
}

/**
 * 激活插件状态
 * @param param0
 */
const handleEnableExtension = ({ request, sendResponse }) => {
  const { extensionId, status } = request
  chrome.management.setEnabled(extensionId, status, () => {
    sendResponse({ status: "Extension enabled" })
  })
}

/**
 * 卸载插件
 * @param param0
 */
const handleUninstallExtension = ({ request, sendResponse }) => {
  const { extensionId } = request
  chrome.management.uninstall(extensionId, {}, () => {
    sendResponse({ status: "Extension uninstalled" })
  })
}

/**
 * 打开插件设置
 * @param param0
 */
const handleOpenOptionsPage = ({ request, sendResponse }) => {
  const { extensionId } = request
  chrome.management.get(extensionId, (extensionInfo) => {
    if (extensionInfo.optionsUrl) {
      chrome.tabs.create({ url: extensionInfo.optionsUrl })
      sendResponse({ status: "Options page opened" })
    } else {
      sendResponse({ status: "No options page available" })
    }
  })
}

/**
 * 插件详情
 * @param param0
 */
const handleOpenExtensionDetails = ({ request, sendResponse }) => {
  const { extensionId } = request
  const detailsUrl = `chrome://extensions/?id=${extensionId}`
  chrome.tabs.create({ url: detailsUrl })
  sendResponse({ status: "Extension details page opened" })
}

/**
 *  插件管理页面
 * @param param0
 * @returns
 */
const handleOpenExtensionPage = ({ request, sendResponse }) => {
  const magUrl = `chrome://extensions/`
  chrome.tabs.create({ url: magUrl })
  return true
}

// arc://extensions/shortcuts
/**
 * 打开插件快捷键页面
 */
function handleOpenExtensionShortcutsPage({ request, sendResponse }) {
  const magUrl = `chrome://extensions/shortcuts`
  chrome.tabs.create({ url: magUrl })
  return true
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
  const { extensionId, iconSize = "128" } = request
  chrome.management.get(extensionId, (extensionInfo) => {
    if (extensionInfo.icons && extensionInfo.icons.length > 0) {
      // 尝试匹配请求的大小，否则使用第一个可用的图标
      let icon =
        extensionInfo.icons.find((icon) => icon.size == iconSize) ||
        extensionInfo.icons[0]

      // 替换协议 chrome:// 为 chrome-extension://
      // 直接发送图标的URL，不尝试下载
      const iconURL = icon.url
      console.log(iconURL)

      // 发送get_extension_icon_blob消息
      chrome.runtime.sendMessage(
        {
          action: "get_extension_icon_blob",
          iconURL
        },
        (response) => {
          console.log(response)
          sendResponse({
            status: "Icon fetched",
            iconDataUrl: response.iconDataUrl
          })
        }
      )

      // sendResponse({ status: 'Icon fetched', iconDataUrl: iconURL });
    } else {
      sendResponse({ status: "No icon available" })
    }
  })
  return true // 保持消息通道打开
}

const handleUpdateExtIcon = ({ request, sendResponse }) => {
  storage.set(HAS_CRX_UPDATE, "")
  chrome.tabs.create({
    url: chrome.runtime.getURL("/tabs/update.html")
  })
}

const handleDisableAllExt = ({ request, sendResponse }) => {
  chrome.management.getAll().then((extensions) => {
    // 跳过自己
    extensions.forEach((ext) => {
      if (ext.enabled) {
        if (ext.id === chrome.runtime.id) return
        chrome.management.setEnabled(ext.id, false)
      }
    })
    sendResponse({ status: "All extensions disabled" })
  })
}

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
  [EXT_UPDATE_DONE]: handleUpdateExtIcon
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 获取插件列表
  const { action } = request
  if (typeof ACTICON_MAP[action] === "function") {
    ACTICON_MAP[action]({ request, sender, sendResponse })
  } else {
    console.log("action---->", action)
  }
  return true // 表示我们将异步发送响应
})

/**
 * 监听此插件的更新,通知更新
 */
// chrome.runtime.onInstalled.addListener(function (details) {
//   const { reason } = details
//   if (['install', 'update'].includes(reason)) {
//     // 通知更新
//     storage.set(HAS_CRX_UPDATE, 'YES')
//     // 获取当前活动选项卡
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       // 向content.js发送消息
//       chrome.tabs.sendMessage(tabs[0].id, { action: EXT_UPDATE }, function (response) {
//         console.log(response.result);
//       });
//     });
//   }
// });
