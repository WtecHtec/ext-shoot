import React from "react";
import ExtensionLogo from "react:./icon.svg";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import { HandleIconUpdate, handleDisableAllExtension } from "~utils/actions";

const CommandPanel_ = () => {
    return (
        <CommandPanel title="extenison-manager" icon={<ExtensionLogo />}>
            <Command.SimpleCommand
                name="update-extension-info"
                title="Update Extension Information"
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

// 用于注册 CommandPanel_ 中的所有子组件的函数
// const registerCommands = () => {
//     const commands = React.Children.toArray((<CommandPanel_ />).props.children);
//     console.log('commands2222', commands);
//     commands.forEach(command => {
//         if (React.isValidElement(command) && command.props.name) {
//             const { name } = command.props;
//             commandManager.registerCommand(name, command as any);
//         }
//     });
// };

// // 调用 registerCommands 来注册组件
// registerCommands();

export { CommandPanel_ };
