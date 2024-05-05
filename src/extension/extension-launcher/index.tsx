import { Command, CommandPanel } from "~component/cmdk/common/Command";
import React, { useEffect } from "react";
import { getExtensionAll } from "~utils/management";

export default function App() {

    const [extDatas, setExtDatas] = React.useState([]); // 页面显示数据

    const getExtensionDatas = async () => {
        const [err, res] = await getExtensionAll();
        if (err || !Array.isArray(res)) {
            return;
        }

        setExtDatas(res);
    };


    useEffect(() => {
        getExtensionDatas();
    }, []);

    useEffect(() => {
        console.log('extDatas updated', extDatas);
    }, [extDatas]); // 这里的依赖项是extDatas

    return (
        <CommandPanel title="Extenison">
            {
                extDatas.map((item, index) => {
                    return (
                        <Command.ExtensionCommand
                            key={index + '-' + item.id}
                            name={item.id}
                            title={item.name}
                            keywords={[item.name]}
                            iconUrl={item.icon}

                        />
                    );
                })
            }
            {/* <Command.SimpleCommand
                name="222-extension-info"
                title="222 Information"
                keywords={[
                    "update",
                    "extension",
                    "info",
                    "Update Extension Information"
                ]}
                handle={() => {
                    console.log('update-extension-info');
                }}
            /> */}
        </CommandPanel>
    );

}

export {
    App as ExtensionLauncher
};