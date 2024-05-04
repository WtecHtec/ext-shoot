import React from "react";
import ExtensionLogo from "react:./icon.svg";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import { HandleIconUpdate, handleDisableAllExtension, handleEnableAllExtension, handleOpenExtensionPage, handleOpenExtensionShortcutsPage } from "~utils/actions";

const CommandPanel_ = () => {
    return (
        <CommandPanel title="Extenison Manager" icon={<ExtensionLogo />}>
            <Command.SimpleCommand
                name="update-extension-info"
                title="Update Information"
                keywords={[
                    "update",
                    "extension",
                    "info",
                    "Update Extension Information"
                ]}
                handle={HandleIconUpdate}
            />
            <Command.SimpleCommand
                name="disable-all-extension"
                title="Disable All Extensions"
                keywords={["disable", "all", "extensions", "Disable All Extensions"]}
                handle={() => {
                    handleDisableAllExtension();
                }}
            />
            <Command.SimpleCommand
                name="enable_all_extension"
                title="Enable All Extensions"
                keywords={['enable', 'Enable all Extension']}
                description="Enable all extensions in the browser"
                handle={() => {
                    handleEnableAllExtension();
                }}
            />
            <Command.SimpleCommand
                name="open_extension_home_page"
                title="Extension HomePage"
                keywords={['open', 'extension', 'home', 'Open Extension HomePage']}
                description="Open Extension Page"
                handle={() => { handleOpenExtensionPage(); }}
            />
            <Command.SimpleCommand
                name="change_extension_shortcuts"
                title="Shortcuts Page"
                keywords={[
                    'shortcuts',
                    'Change Extenion Shortcuts',
                    'key',
                    'keymap',
                    'keybindings',
                    'keyboard'
                ]}
                description="Change Extenion Shortcuts"
                handle={() => { handleOpenExtensionShortcutsPage(); }}
            />


        </CommandPanel>
    );
};

export { CommandPanel_ };
