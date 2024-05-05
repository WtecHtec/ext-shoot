import React from "react";
import List from "./List";
import { ActionPanel } from "./ActionPanel";
import { Action } from "./Action";
import { ActivatePluginIcon, ExtensionIcon } from "~component/icons";
// import { commandManager } from "../command/command-manager";

interface CommandPanelProps {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
}

const CommandPanel: React.FC<CommandPanelProps> = ({ children, title, icon }) => {
    // 映射子组件，为没有指定 extension 或 icon 的子组件添加这些属性
    const enhancedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const childProps = child.props;
            const newProps: { extension?: string; icon?: React.ReactNode } = {};
            if (!('extension' in childProps) && title) {
                newProps.extension = title;
            }
            if (!('icon' in childProps) && icon) {
                newProps.icon = icon;
            }
            const newEle = React.cloneElement(child, newProps);
            // if (childProps.name) {
            // commandManager.registerCommand(childProps.name, () => newEle as any);
            // }
            return newEle;
        }
        return child;
    });

    return <>{enhancedChildren}</>;
};

interface BaseCommand {
    name: string;
    title?: string;
    keywords?: string[];
    description?: string;
    mode?: string;
    icon?: string | React.ReactNode;
    extension?: string;
}

interface SimpleCommandProps extends BaseCommand {
    handle: () => void;
}
const SimpleCommand = ({
    name,
    title,
    keywords,
    handle,
    icon,
    extension,

}: SimpleCommandProps) => {
    return (
        <List.Item
            id={name}
            key={name}
            title={title}
            keywords={keywords}
            icon={icon}
            author={extension}
            onSelect={
                () => {
                    handle();
                }
            }
            actions={
                <ActionPanel head={title}>
                    <ActionPanel.Section >
                        <Action.ExecuteCommand
                            handle={handle}
                        />

                    </ActionPanel.Section>
                </ActionPanel>
            }
        />);

};


interface ExtensionCommandProps extends BaseCommand {
    children?: React.ReactNode
    iconUrl?: string,
    handle: () => void;
}
const ExtensionCommand = ({
    children,
    name,
    title,
    keywords,
    description,
    iconUrl,
    handle,
}: ExtensionCommandProps) => {
    return (
        <List.Item
            id={name}
            key={name}
            title={title}
            subtitle={description}
            keywords={keywords}
            icon={<ExtensionIcon base64={iconUrl} />}
            author={null}
            type={'Extension'}
            actions={
                <ActionPanel head={title}>
                    <ActionPanel.Section>
                        <Action.BaseAction
                            value="Active Extension"
                            keywords={["Active Extension"]}
                            icon={<ActivatePluginIcon />}
                            onSelect={() => handle()} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        >
            {children}
        </List.Item>
    );
};

// placehold command on first render
const PlaceholderCommand = () => {
    return (
        <List.Item cls='!hidden' id={"placeholder"} key={"placeholder"} title={"placeholder"} />
    );
};

const Command = {
    SimpleCommand,
    ExtensionCommand,
    PlaceholderCommand,
};

export {
    Command,
    CommandPanel,
};
