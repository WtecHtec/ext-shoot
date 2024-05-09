import React from "react";

import { Action } from "./Action";
import { ActionPanel } from "./ActionPanel";
import List from "./List";
import { searchManager } from "../search/search-manager";
import { exitPanel } from "../panel";

// import { commandManager } from "../command/command-manager";


export const ExitAndClearSearch = () => {
    searchManager.clearSearch();
    exitPanel();
};
interface CommandPanelProps {
    children: React.ReactNode
    title?: string
    icon?: React.ReactNode
}

const CommandPanel: React.FC<CommandPanelProps> = ({
    children,
    title,
    icon
}) => {
    // 映射子组件，为没有指定 extension 或 icon 的子组件添加这些属性
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            const childProps = child.props;
            const newProps: { extension?: string; icon?: React.ReactNode, name?: string } = {};
            if (!("extension" in childProps) && title) {
                newProps.extension = title;
            }
            if (!("icon" in childProps) && icon) {
                newProps.icon = icon;
            }

            // 给子组件的 name 属性添加前缀
            if (childProps.name) {
                newProps.name = `${title}-${childProps.name}`;
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

export interface BaseCommand {
    name: string
    title?: string
    keywords?: string[]
    description?: string
    mode?: string
    icon?: string | React.ReactNode
    extension?: string
}

interface SimpleCommandProps extends BaseCommand {
    handle: () => void
    endAfterRun?: boolean
}
const SimpleCommand = ({
    name,
    title,
    keywords,
    handle,
    icon,
    extension,
    endAfterRun,
}: SimpleCommandProps) => {

    const finalHandle = endAfterRun ? () => {
        handle();
        ExitAndClearSearch();
    } : handle;

    return (
        <List.Item
            id={name}
            key={name}
            title={title}
            keywords={keywords}
            icon={icon}
            author={extension}
            onSelect={finalHandle}
            actions={
                <ActionPanel head={title}>
                    <ActionPanel.Section>
                        <Action.ExecuteCommand handle={finalHandle} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
};

// placehold command on first render
const PlaceholderCommand = () => {
    return (
        <List.Item
            cls="!hidden"
            id={"placeholder"}
            key={"placeholder"}
            title={"placeholder"}
        />
    );
};

const Command = {
    SimpleCommand,
    PlaceholderCommand
};

export { Command, CommandPanel };
