
import { ExtensionLauncher, ExtensionManagerCommand } from '~extension';
import React, { } from 'react';
import { Command } from '~component/cmdk/common/Command';


const ExtensionLoader = () => {
    return (
        <>
            <Command.PlaceholderCommand />
            <ExtensionLauncher />
            <ExtensionManagerCommand />
        </>
    );
};

// const ExtensionRender = () => {
//     const [commands, setCommands] = React.useState(commandManager.commandNames);
//     const [registeredCommandMaps, setRegisteredCommandMaps] = React.useState(commandManager.allCommands);
//     useEffect(() => {
//         const unsubscribe = commandManager.subscribe(({ commands, registeredCommandMaps }) => {
//             setCommands(commands);
//             setRegisteredCommandMaps(registeredCommandMaps);
//             console.log('registeredCommandMaps', registeredCommandMaps);
//         });
//         return () => {
//             unsubscribe(); // Clean up the subscription when the component unmounts
//         };
//     }, []);

//     useEffect(() => {
//         console.log('commands updated', registeredCommandMaps);

//     }, [registeredCommandMaps]);


// return (
//     <>
//         {
//             commands.map((key) => {
//                 const Command = registeredCommandMaps[key];
//                 return <Command key={key} />;
//             })
//         }
//     </>
// );
const CommandUI = () => {
    return (
        <>
            {/* {<ExtensionRender />} */}
            {< ExtensionLoader />}
        </>
    );
};

export {
    CommandUI
};
