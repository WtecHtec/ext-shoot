import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';
import TabManager from '~lib/atoms/browser-tab-manager';

const tabAction = TabManager.action;

const TabManagerComand = () => {
  return (
    <MotionPack title="Quick Link" icon={ExtensionLogo}>
      <Motion.Simple
        name="open-downloads-page"
        title="Downloads Page"
        keywords={['downloads', 'Open Downloads Page']}
        description="Open the browser's downloads page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://downloads/');
        }}
      />

      <Motion.Simple
        name="open-extensions-page"
        title="Extensions Page"
        keywords={['extensions', 'Open Extensions Page']}
        description="Open the browser's extensions page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://extensions/');
        }}
      />

      <Motion.Simple
        name="open-history-page"
        title="History Page"
        keywords={['history', 'Open History Page']}
        description="Open the browser's history page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://history/');
        }}
      />

      <Motion.Simple
        name="open-settings-page"
        title="Settings Page"
        keywords={['settings', 'Open Settings Page']}
        description="Open the browser's settings page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://settings/');
        }}
      />

      <Motion.Simple
        name="open-bookmarks-page"
        title="Bookmarks Page"
        keywords={['bookmarks', 'Open Bookmarks Page']}
        description="Open the browser's bookmarks page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://bookmarks/');
        }}
      />

      <Motion.Simple
        name="open-shortcuts-page"
        title="Shortcuts Page"
        keywords={['shortcuts', 'Open Shortcuts Page']}
        description="Open the browser's shortcuts page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://extensions/shortcuts');
        }}
      />
      <Motion.Simple
        name="open-password-manager"
        title="Password Manager Page"
        keywords={['password', 'Open Password Manager']}
        description="Open the browser's password manager"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://password-manager');
        }}
      />
      <Motion.Simple
        name="open-languages-settings"
        title="Languages Setting Page"
        keywords={['languages', 'Open Languages Settings']}
        description="Open the browser's language settings page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab('chrome://settings/languages');
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
