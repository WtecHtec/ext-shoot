import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';
import tabManage from '~lib/atoms/browser-tab-manager';

const TabAction = tabManage.action;
const TabManagerComand = () => {
  return (
    <MotionPack title="Tab Agent" icon={ExtensionLogo}>
      <Command.Simple
        name="reload-page"
        title="Refresh the Page"
        endAfterRun
        keywords={['reload', 'refresh', 'Reload Page', 'Refresh Page', 'Reload']}
        handle={() => {
          TabAction.reloadTab();
        }}
      />
      <Command.Simple
        name="duplicate-tab"
        title="Duplicate Current Tab"
        keywords={['duplicate', 'Duplicate Tab']}
        description="Duplicate current tab"
        endAfterRun
        handle={() => {
          TabAction.duplicateTab();
        }}
      />

      <Command.Simple
        name="go-back-tab"
        title="Go Back"
        keywords={['go back', 'Go Back Tab']}
        description="Go back in the tab history"
        endAfterRun
        handle={async () => {
          TabAction.currentGoBack();
        }}
      />

      <Command.Simple
        name="go-forward-tab"
        title="Go Forward"
        keywords={['go forward', 'Go Forward Tab']}
        description="Go forward in the tab history"
        endAfterRun
        handle={async () => {
          TabAction.currentGoForward();
        }}
      />

      <Command.Simple
        name="pin-tab"
        title="Pin ths Page"
        keywords={['pin', 'Pin Tab']}
        description="Pin the current tab"
        endAfterRun
        handle={async () => {
          TabAction.togglePinTab();
        }}
      />
      <Command.Simple
        name="close-current-page"
        title="Close Current Tab"
        keywords={['close', 'Close Current Page']}
        description="Close the current "
        endAfterRun
        handle={async () => {
          TabAction.closeCurrentTab();
        }}
      />
      <Command.Simple
        name="restore-last-page"
        title="Restore Last Close Page"
        keywords={['restore', 'Restore Last Page']}
        description="Restore the last closed tab"
        endAfterRun
        handle={async () => {
          TabAction.openLastClosedTab();
        }}
      />
      <Command.Simple
        name="mute-current-tab"
        title="Mute Current Tab"
        keywords={['mute', 'Mute Current Tab']}
        description="Mute the current tab"
        endAfterRun
        handle={async () => {
          TabAction.toggleMuteTab();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
