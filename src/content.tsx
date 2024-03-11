import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"

import { CountButton } from "~component/count-button"
import SwitchDemo from "~component/switch/switch"
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  return (
    <div className="fixed z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <SwitchDemo />
    </div>
  )
}

export default PlasmoOverlay
