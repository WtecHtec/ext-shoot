import React from "react";
import RefreshExtensionInfo from "react:~asset/refresh_entension_infomation.svg";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
import { HandleIconUpdate } from "~utils/actions";

const ExtensionManager = {
  commands: [
    {
      name: "Disable all Extension",
      value: "disable_all_extension",
      keywords: ["ban", "disable", "Disable all Extension"],
      // icon: <DisableAllIcon />,
      description: "Disable all extensions in the browser",
      refresh: true
      // handle: handleDisableAllExtension,
    }
  ]
};

// const UpdateExtension: React.FC = () => {
//     return (
//         <Command.SimpleCommand
//             name='update-extension-info'
//             title='Update Extension Information'
//             keywords={['update', 'extension', 'info', 'Update Extension Information']}
//             handle={HandleIconUpdate}
//             icon={<RefreshExtensionInfo />}
//         />);
// };

// commandManager.registerCommand('UpdateExtension', UpdateExtension);

const CommandPanel_ = () => {
  return (
    <CommandPanel title="extenison-manager">
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
        icon={<RefreshExtensionInfo />}
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

export { ExtensionManager, CommandPanel_ };
