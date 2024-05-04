import React from "react";
import ExtensionLogo from "react:./icon.svg";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import { HandleIconUpdate, handleDisableAllExtension } from "~utils/actions";

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
                handle={() => handleDisableAllExtension}
            />
        </CommandPanel>
    );
};

export { CommandPanel_ };
