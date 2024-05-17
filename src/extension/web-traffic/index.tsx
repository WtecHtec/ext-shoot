import ExtensionLogo from "data-base64:./icon.png";
import React from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import TabManager from "~lib/atoms/browser-tab-manager";

const tabAction = TabManager.action;

const TabManagerComand = () => {
  return (
    <CommandPanel title="Web Traffic" icon={ExtensionLogo}>
      <Command.SimpleCommand
        name="web-traffic"
        title="Web Traffic"
        keywords={["web traffic", "web"]}
        description="Open the browser's web traffic page"
        endAfterRun
        handle={async () => {
          await tabAction.createTabInactive("chrome://downloads/");
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
