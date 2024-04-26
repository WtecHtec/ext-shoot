import React, { useEffect, useState } from 'react';

// Simulated plugin imports
import storeSearch from '~app/store-search';
import { appManager } from './app-manager';
import { MotionPlugin } from './app';

// Define a plugin interface


// Example plugin objects, assuming imports are objects with 'name' and 'component'
const plugins: MotionPlugin[] = [
    storeSearch
];

// Create a mapping from plugin names to their React components
const pluginComponents: { [key: string]: React.ComponentType<any> } = plugins.reduce((acc, plugin) => {
    acc[plugin.name] = plugin.App;
    return acc;
}, {} as { [key: string]: React.ComponentType<any> });

const AppUI: React.FC = () => {
    const [activeAppName, setActiveAppName] = useState(appManager.activeApp || '');
    const [inApp,setInApp] = useState<boolean>(appManager.ifInApp);

    useEffect(() => {
        const unsubscribe = appManager.subscribe(({ activeApp,inAppMode}) => {
            setActiveAppName(activeApp);
            setInApp(inAppMode);
        });

        return () => {
            unsubscribe(); // Clean up the subscription when the component unmounts
        };
    }, []);

    // 注册所有的app
    plugins.forEach(plugin => {
        appManager.registerApp(plugin.name);
    });

    const ActiveAppComponent = activeAppName ? pluginComponents[activeAppName] : null;

    return (
        <div hidden={!inApp}>
            {ActiveAppComponent ? <ActiveAppComponent /> : <p>No active app.</p>}
        </div>
    );
};

export default AppUI;
