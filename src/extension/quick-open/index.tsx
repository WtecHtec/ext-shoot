import ExtensionLogo from "data-base64:./icon.png";
import React from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import TabManager from "~lib/atoms/browser-tab-manager";

const tabAction = TabManager.action;

const TabManagerComand = () => {
  return (
    <CommandPanel title="Quick Link" icon={ExtensionLogo}>
      <Command.SimpleCommand
        name="open-downloads-page"
        title="Downloads Page"
        keywords={["downloads", "Open Downloads Page"]}
        description="Open the browser's downloads page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://downloads/");
        }}
      />

      <Command.SimpleCommand
        name="open-extensions-page"
        title="Extensions Page"
        keywords={["extensions", "Open Extensions Page"]}
        description="Open the browser's extensions page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://extensions/");
        }}
      />

      <Command.SimpleCommand
        name="open-history-page"
        title="History Page"
        keywords={["history", "Open History Page"]}
        description="Open the browser's history page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://history/");
        }}
      />

      <Command.SimpleCommand
        name="open-settings-page"
        title="Settings Page"
        keywords={["settings", "Open Settings Page"]}
        description="Open the browser's settings page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://settings/");
        }}
      />

      <Command.SimpleCommand
        name="open-bookmarks-page"
        title="Bookmarks Page"
        keywords={["bookmarks", "Open Bookmarks Page"]}
        description="Open the browser's bookmarks page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://bookmarks/");
        }}
      />

      <Command.SimpleCommand
        name="open-shortcuts-page"
        title="Shortcuts Page"
        keywords={["shortcuts", "Open Shortcuts Page"]}
        description="Open the browser's shortcuts page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://extensions/shortcuts");
        }}
      />
      <Command.SimpleCommand
        name="open-password-manager"
        title="Password Manager Page"
        keywords={["password", "Open Password Manager"]}
        description="Open the browser's password manager"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://password-manager");
        }}
      />
      <Command.SimpleCommand
        name="open-languages-settings"
        title="Languages Setting Page"
        keywords={["languages", "Open Languages Settings"]}
        description="Open the browser's language settings page"
        endAfterRun
        handle={async () => {
          await tabAction.createTab("chrome://settings/languages");
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
