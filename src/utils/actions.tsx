import React from "react"
import DisableAllIcon from "react:~component/asset/disable-all-extension.svg"
import ExtensionHomePageIcon from "react:~component/asset/extension-homepage.svg"
import ExtensionShortcutIcon from "react:~component/asset/extension-shortcut.svg"

/**
 * 打开插件设置页面
 * @returns
 */
const handleDisableAllExtension = (): Promise<[null | Error, any]> => {
  return new Promise((resolve) => {
    // todo Notification
    chrome.runtime
      .sendMessage({ action: "disable_all_extension" })
      .then(async (response) => {
        resolve([null, response])
      })
      .catch((err) => {
        resolve([err, null])
      })
  })
}

/**
 * 打开插件设置页面
 * @returns
 */
const handleOpenExtensionPage = (): Promise<[null | Error, any]> => {
  return new Promise((resolve) => {
    chrome.runtime
      .sendMessage({ action: "open_extension_homepage" })
      .then(async (response) => {
        resolve([null, response])
      })
      .catch((err) => {
        resolve([err, null])
      })
  })
}

// 打开插件快捷键页面
const handleOpenExtensionShortcutsPage = (): Promise<[null | Error, any]> => {
  return new Promise((resolve) => {
    chrome.runtime
      .sendMessage({ action: "open_extension_shortcuts" })
      .then(async (response) => {
        resolve([null, response])
      })
      .catch((err) => {
        resolve([err, null])
      })
  })
}

export const ActionMeta = [
  {
    name: "Disable all Extension",
    value: "disable_all_extension",
    keywords: ["ban", "disable", "Disable all Extension"],
    icon: <DisableAllIcon />,
    desc: "Disable all extensions in the browser",
    handle: handleDisableAllExtension
  },
  // Open Extension Page
  {
    name: "Open Extension HomePage",
    value: "open_extension_page",
    keywords: ["open", "extension", "Open Extension Page"],
    icon: <ExtensionHomePageIcon />,
    desc: "Open Extension Page",
    handle: handleOpenExtensionPage
  },
  // 打开插件快捷键页面
  {
    name: "Change Extenion Shortcuts",
    value: "change_extension_shortcuts",
    keywords: ["shortcuts", "Change Extenion Shortcuts"],
    icon: <ExtensionShortcutIcon />,
    desc: "Change Extenion Shortcuts",
    handle: handleOpenExtensionShortcutsPage
  }
]
