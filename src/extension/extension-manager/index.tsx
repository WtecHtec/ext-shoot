import React from 'react';
import ExtensionLogo from 'react:./icon.svg';

import { Command } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';

import {
  handleDisableAllExtension,
  handleEnableAllExtension,
  HandleIconUpdate,
  handleOpenExtensionPage,
  handleOpenExtensionShortcutsPage
} from './handler';

const ExtensionManagerCommand = () => {
  return (
    <MotionPack title="Extenison Agent" icon={<ExtensionLogo />}>
      <Command.Simple
        name="update-extension-info"
        title="Update Information"
        keywords={['update', 'extension', 'info', 'Update Extension Information']}
        handle={HandleIconUpdate}
      />
      <Command.Simple
        name="disable-all-extension"
        title="Disable All Extensions"
        keywords={['disable', 'all', 'extensions', 'Disable All Extensions']}
        handle={() => {
          handleDisableAllExtension();
        }}
      />
      <Command.Simple
        name="enable_all_extension"
        title="Enable All Extensions"
        keywords={['enable', 'Enable all Extension']}
        description="Enable all extensions in the browser"
        handle={() => {
          handleEnableAllExtension();
        }}
      />
      <Command.Simple
        name="open_extension_home_page"
        title="Open Extension Page"
        keywords={['open', 'extension', 'home', 'Open Extension HomePage']}
        description="Open Extension Page"
        handle={() => {
          handleOpenExtensionPage();
        }}
      />
      <Command.Simple
        name="change_extension_shortcuts"
        title="Open Extension Shortcuts Page"
        keywords={['shortcuts', 'Change Extenion Shortcuts', 'key', 'keymap', 'keybindings', 'keyboard']}
        description="Change Extenion Shortcuts"
        handle={() => {
          handleOpenExtensionShortcutsPage();
        }}
      />
    </MotionPack>
  );
};

export { ExtensionManagerCommand };
