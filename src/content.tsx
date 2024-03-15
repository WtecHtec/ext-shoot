import componentStyles from "data-text:~style.all.scss"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React from "react"

import { RaycastCMDK } from "~component/cmdk/menu"
import { CMDKWrapper } from "~component/common"
import { handleExtUpdateDone, handleOpenCrxWin } from "~utils/management"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  exclude_matches: ["https://gemini.google.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText + componentStyles
  return style
}

const PlasmoOverlay = () => {
  const [open, setOpen] = React.useState(true)
  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        // setOpen(false)
        handleOpenCrxWin()
      }
      // 改为 cmd + / 打开

      if (e.key === "/" && e.metaKey) {
        e.preventDefault()
        setOpen((o) => !o)
        handleOpenCrxWin()
      }

      // if (e.key === "U") {
      //   e.preventDefault()
      //   setOpen(false)
      //   handleExtUpdateDone()
      // }
    }

    document.addEventListener("keydown", listener)

    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [])
  return (
    <>
      <div
        style={ { display: open ? 'block' : 'none' } }
        className="fixed z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {/* {open ? (
          <CMDKWrapper>
            <RaycastCMDK />
          </CMDKWrapper>
        ) : null} */}
      </div>
    </>
  )
}

export default PlasmoOverlay
