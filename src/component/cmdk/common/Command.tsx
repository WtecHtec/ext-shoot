import React from "react";
import List from "./List";

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
            console.log('childProps.name', childProps.name);
            // 注册命令
            if (childProps.name) {
                // commandManager.registerCommand(childProps.name, child.type as React.ComponentType<any>);
            }
            return React.cloneElement(child, newProps);
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
        />);

};

const Command = {
    SimpleCommand,
};

export {
    Command,
    CommandPanel,
};
