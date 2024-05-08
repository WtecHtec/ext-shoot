import React from "react";
import ExtensionLogo from "react:./icon.svg";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import tabManage from '~lib/atoms/browser-tab-manager';

const TabAction = tabManage.action;
const TabManagerComand = () => {
  return (
    <CommandPanel title="Tab Agent" icon={<ExtensionLogo />}>
      <Command.SimpleCommand
        name="reload-page"
        title="Reload Page"
        keywords={[
          "reload",
          "refresh",
          "Reload Page",
          "Refresh Page",
          "Reload"
        ]}
        handle={() => {
          TabAction.reloadTab();
        }}
      />
      <Command.SimpleCommand
        name="duplicate-tab"
        title="Duplicate Tab"
        keywords={["duplicate", "Duplicate Tab"]}
        description="Duplicate current tab"
        handle={
          () => {
            TabAction.duplicateTab();
          }
        }
      />

      <Command.SimpleCommand
        name="go-back-tab"
        title="Go Back Tab"
        keywords={["go back", "Go Back Tab"]}
        description="Go back in the tab history"
        handle={
          () => {
            const currentTab = TabAction.getCurrentTab();
            TabAction.goBack(currentTab);
          }
        }
      />

    </CommandPanel>
  );
};

export default TabManagerComand;
