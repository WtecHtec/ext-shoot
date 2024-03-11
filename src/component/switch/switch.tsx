import * as Switch from "@radix-ui/react-switch"
import React from "react"


const SwitchDemo = () => (
  <form>
    <div style={{ display: "flex", alignItems: "center" }}>
      <label
        className="Label"
        htmlFor="airplane-mode"
        style={{ paddingRight: 15 }}>
        Switch Btn
      </label>
      <Switch.Root className="SwitchRoot" id="airplane-mode">
        <Switch.Thumb className="SwitchThumb" />
      </Switch.Root>
    </div>
  </form>
)

export default SwitchDemo
