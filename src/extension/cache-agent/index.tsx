import React from "react";
import ExtensionLogo from "data-base64:./icon.png";
import { Command, CommandPanel } from "~component/cmdk/common/Command";
import DataManager from '~lib/atoms/browser-data-manager';
import TabManager from '~lib/atoms/browser-tab-manager';

const dataAction = DataManager.action;
const tabAction = TabManager.action;
const TabManagerComand = () => {
  return (
    <CommandPanel title="Cache Agent" icon={ExtensionLogo}>
      <Command.SimpleCommand
        name="clear-current-url-cache"
        title="Clear Current Url Cache"
        keywords={["clear", "Clear Current URL Cache"]}
        description="Clear the cache for the current URL"
        endAfterRun
        handle={
          async () => {
            const tab = await tabAction.getCurrentTab();
            await dataAction.clearAllCacheByURL(tab.url);
            await tabAction.reloadTab();
          }
        }
      />

    </CommandPanel>
  );
};

export default TabManagerComand;
