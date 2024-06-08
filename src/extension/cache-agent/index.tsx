import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';
import DataManager from '~lib/atoms/browser-cache-manager';
import TabManager from '~lib/atoms/browser-tab-manager';

const dataAction = DataManager.action;
const tabAction = TabManager.action;
const TabManagerComand = () => {
  return (
    <MotionPack title="Cache Agent" icon={ExtensionLogo}>
      <Command.Simple
        name="clear-current-url-cache"
        title="Clear Current Url Cache"
        keywords={['clear', 'Clear Current URL Cache']}
        description="Clear the cache for the current URL"
        endAfterRun
        handle={async () => {
          const tab = await tabAction.getCurrentTab();
          await dataAction.clearAllCacheByURL(tab.url);
          await tabAction.reloadTab();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
