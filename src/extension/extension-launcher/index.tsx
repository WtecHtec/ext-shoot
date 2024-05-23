import { CommandPanel } from "~component/cmdk/common/Command";
import React, { useEffect } from "react";
import { getExtensionAll } from "~utils/management";
import { onHandleActiveExtension, onHandleShowInFinder, onHanldePulginStatus } from "./handle";
import { ExtensionCommand } from "./command-item";
import { ActionPanel } from "~component/cmdk/common/ActionPanel";
import { Action } from "~component/cmdk/common/Action";
import { ActivatePluginIcon, EnableIcon, ShowInFinderIcon } from "~component/icons";

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
                        <ExtensionCommand
                            key={index + '-' + item.id}
                            name={item.id}
                            title={item.name}
                            keywords={[item.name]}
                            iconUrl={item.icon}
                            cls={!item.enabled && "grayscale"}
                            handle={() => {
                                onHandleActiveExtension({
                                    id: item.id,
                                    name: item.name,
                                    enabled: item.enabled,
                                });
                            }}
                            actions={
                                <ActionPanel head={item.name}>
                                    <ActionPanel.Section>
                                        <Action.BaseAction
                                            value="Active Extension"
                                            keywords={["Active Extension"]}
                                            icon={<ActivatePluginIcon />}
                                            onSelect={() => onHandleActiveExtension({
                                                id: item.id,
                                                name: item.name,
                                                enabled: item.enabled,
                                            })} />
                                        <Action.BaseAction
                                            value="Show In Finder "
                                            keywords={["show", "finder"]}
                                            icon={<ShowInFinderIcon />}
                                            onSelect={() => onHandleShowInFinder({
                                                id: item.id,
                                                name: item.name,
                                            })} />

                                        <Action.BaseAction
                                            value="Toggle Extension Status"
                                            keywords={["toggle", "enable"]}
                                            icon={<EnableIcon />}
                                            onSelect={() => onHanldePulginStatus({
                                                id: item.id,
                                                status: !item.enabled,
                                            })} />
                                    </ActionPanel.Section>
                                </ActionPanel>

                            }
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