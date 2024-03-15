import React from "react"
import DisableAllIcon from "react:~component/icons/disable-all-extension.svg"

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

export const ActionMeta = [
  {
    name: "Disable all Extension",
    value: "disable_all_extension",
    keywords: ["ban", "disable", "Disable all Extension"],
    icon: <DisableAllIcon />,
    desc: "Disable all extensions in the browser",
    handle: handleDisableAllExtension
  }
]
