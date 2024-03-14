import React from "react";
import { getIcon, getBase64FromIconUrl } from "~utils/util";
import { Storage } from "@plasmohq/storage"
import { ICON_CACHE } from "~config/cache.config";
export default function useUpdateIcon() {
  const [status, setStatus] = React.useState(false)
  React.useEffect(() => {
    const storage = new Storage({
      area: "local"
    })
    chrome.management.getAll().then(async (extensions) => {
      const cacheDatas = {}
      for (let i = 0; i < extensions.length; i++) {
        const { id, icons } = extensions[i];
        const icon = getIcon(icons);
        try {
          const base64 = await getBase64FromIconUrl(icon)
          cacheDatas[id] = base64
        } catch (error) {
          console.error('useUpdateIcon---->', error)
        }
      }
      await storage.set(ICON_CACHE, cacheDatas)
      setStatus(true)
    });
  }, [])
  return [status]
}