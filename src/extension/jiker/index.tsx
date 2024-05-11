import ExtensionLogo from "data-base64:./icon.jpg";
import React from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
// import DataManager from "~lib/atoms/browser-cache-manager"
import TabManager from "~lib/atoms/browser-tab-manager";

// const dataAction = DataManager.action;
const tabAction = TabManager.action;
const TabManagerComand = () => {
  return (
    <CommandPanel title="Jiker" icon={ExtensionLogo}>
      <Command.SimpleCommand
        name="new-post-page"
        title="Open New Post Page"
        keywords={["new post", "Open New Post Page"]}
        description="Open Jike's new post page"
        endAfterRun
        handle={async () => {
          tabAction.changeCurrentTabUrl("https://web.okjike.com");
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
