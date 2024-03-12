import { CountButton } from "~component/count-button"

import "~style.css"

function IndexPopup() {
  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
      <img src="chrome://extension-icon/abpdnfjocnmdomablahdcfnoggeeiedb/128/0" />
      <CountButton />
    </div>
  )
}

export default IndexPopup
