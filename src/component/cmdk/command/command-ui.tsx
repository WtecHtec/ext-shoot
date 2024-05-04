
import { CommandPanel_ } from '~extension';
import { commandManager } from './command-manager';
import React, { useEffect } from 'react';
// import '~extension';

const CommandUI = () => {
    const [commands, setCommands] = React.useState(commandManager.commandNames);

    useEffect(() => {
        const unsubscribe = commandManager.subscribe(({ commands }) => {
            setCommands(commands);
        });
        return () => {
            unsubscribe(); // Clean up the subscription when the component unmounts
        };
    }, []);

    // useEffect(() => {
    //     console.log('commands22222', commands);
    // }, []);

    return (<>

        {< CommandPanel_ />}
        {
            commands.map(key => {
                const PluginComponent = commandManager.getCommand(key);
                // console.log('PluginComponent', PluginComponent);
                return <PluginComponent key={key} />;
            })}
    </>
    );
};

export {
    CommandUI
};