import componentStyles from "data-text:~style.all.scss"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React from "react"

import { RaycastCMDK } from "~component/cmdk/menu"
import { CMDKWrapper } from "~component/common"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText + componentStyles
  return style
}

const PlasmoOverlay = () => {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
      }
      if (e.key === "f") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    document.addEventListener("keydown", listener)

    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [])
  return (
    <div
      style={{ display: open ? "block" : "none" }}
      className="fixed z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <CMDKWrapper>
        <RaycastCMDK />
      </CMDKWrapper>
    </div>
  )
}

export default PlasmoOverlay
