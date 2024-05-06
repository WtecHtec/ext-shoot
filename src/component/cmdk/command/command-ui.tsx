
import { ExtensionLauncher, ExtensionManagerCommand } from '~extension';
import { commandManager } from './command-manager';
import React, { useEffect } from 'react';
import { Command } from '../common/Command';


const ExtensionLoader = () => {
    return (
        <>
            <Command.PlaceholderCommand />
            <ExtensionLauncher />
            <ExtensionManagerCommand />
        </>
    );
};

export const ExtensionRender = () => {
    const [commands, setCommands] = React.useState(commandManager.commandNames);

    useEffect(() => {
        const unsubscribe = commandManager.subscribe(({ commands }) => {
            setCommands(commands);
        });
        return () => {
            unsubscribe(); // Clean up the subscription when the component unmounts
        };
    }, []);
    return (
        <>
            {
                commands.map(key => {
                    const PluginComponent = commandManager.getCommand(key);
                    return <PluginComponent key={key} />;
                })
            }
        </>
    );
};
const CommandUI = () => {

    return (
        <>
            {< ExtensionLoader />}
            {/* {<ExtensionRender />} */}
        </>
    );
};

export {
    CommandUI
};