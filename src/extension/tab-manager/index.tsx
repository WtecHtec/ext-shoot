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
        endAfterRun

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
        endAfterRun
        handle={
          () => {
            TabAction.duplicateTab();
          }
        }
      />

      <Command.SimpleCommand
        name="go-back-tab"
        title="Go Back"
        keywords={["go back", "Go Back Tab"]}
        description="Go back in the tab history"
        endAfterRun
        handle={
          async () => {
            TabAction.currentGoBack();
          }
        }
      />

      <Command.SimpleCommand
        name="go-forward-tab"
        title="Go Forward"
        keywords={["go forward", "Go Forward Tab"]}
        description="Go forward in the tab history"
        endAfterRun
        handle={
          async () => {
            TabAction.currentGoForward();
          }
        } />

      <Command.SimpleCommand
        name="pin-tab"
        title="Pin Tab"
        keywords={["pin", "Pin Tab"]}
        description="Pin the current tab"
        endAfterRun
        handle={
          async () => {
            TabAction.togglePinTab();
          }
        }
      />

    </CommandPanel>
  );
};

export default TabManagerComand;
