import { Command, CommandPanel } from "~component/cmdk/common/Command";
import React, { useEffect } from "react";
import { getExtensionAll } from "~utils/management";
import { ExtensionIcon } from '~component/icons';

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
                extDatas.map((item) => {
                    return (
                        <Command.SimpleCommand
                            key={item.id}
                            name={item.id}
                            title={item.name}
                            keywords={['extension', item.name]}
                            icon={<ExtensionIcon base64={item.icon} />}
                            handle={() => {
                                console.log('open extension', item.id);
                            }}
                        />
                    );
                })
            }
        </CommandPanel>
    );

}

export {
    App as ExtensionLauncher
};
