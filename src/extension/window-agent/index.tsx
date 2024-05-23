import React from "react";
import ExtensionLogo from "data-base64:./icon.png";
import { Command, CommandPanel } from "~component/cmdk/common/Command";
import WindowManage from '~lib/atoms/browser-window-manager';

const windowAction = WindowManage.action;
const TabManagerComand = () => {
  return (
    <CommandPanel title="Windows Agent" icon={ExtensionLogo}>
      <Command.SimpleCommand
        name="new-incognito-window"
        title="New Incognito Window"
        keywords={["incognito", "New Incognito Window"]}
        description="Open a new incognito window"
        endAfterRun
        handle={
          async () => {
            windowAction.openIncognitoWindow();
          }
        }
      />

      <Command.SimpleCommand
        name="close-current-window"
        title="Close Current Window"
        keywords={["close", "Close Current Window"]}
        description="Close the current window"
        endAfterRun
        handle={
          async () => {
            windowAction.closeCurrentWindow();
          }
        }
      />

    </CommandPanel>
  );
};

export default TabManagerComand;
