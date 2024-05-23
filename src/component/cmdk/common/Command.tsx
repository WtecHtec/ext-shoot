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

// 扩展 BaseCommand 用于新属性
interface CommandProps extends BaseCommand {
    extension?: string;
    icon?: React.ReactNode;
}

const CommandPanel: React.FC<{ children: React.ReactNode, title?: string, icon?: React.ReactNode }> = ({
    children,
    title,
    icon
}) => {
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement<BaseCommand>(child)) {
            const childProps = child.props;
            // 使用展开操作符简化属性的合并和覆盖
            const newProps: CommandProps = {
                ...childProps,
                extension: childProps.extension ?? title,
                icon: childProps.icon ?? icon,
                name: childProps.name ? `${title}-${childProps.name}` : childProps.name,
                keywords: childProps.keywords ? childProps.keywords.map(keyword => `${title}-${keyword}`) : childProps.keywords
            };
            return React.cloneElement(child, newProps);
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
