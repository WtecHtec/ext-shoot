import React from "react";

import { Action } from "./Action";
import { ActionPanel } from "./ActionPanel";
import List from "./List";
import { searchManager } from "../search/search-manager";
import { exitPanel } from "../panel";
import { Topic } from "../topic/topic";

// 声明 BaseCommand 接口
export interface BaseCommand {
    name: string;
    title?: string;
    keywords?: string[];
    description?: string;
    mode?: string;
    icon?: string | React.ReactNode;
    extension?: string;
}

// ExitAndClearSearch 函数
export const ExitAndClearSearch = () => {
    searchManager.clearSearch();
    exitPanel();
};

type CommandPanelProps = {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    topics?: Topic[];
};

// CommandPanel 组件
const CommandPanel: React.FC<CommandPanelProps> = ({
    children,
    title,
    icon,
    topics
}) => {
    const enhanceChild = (child: React.ReactNode): React.ReactNode => {
        if (!React.isValidElement<BaseCommand>(child)) {
            return child;
        }

        const { props: childProps } = child;
        const { extension = title, icon: childIcon = icon, name: childName, keywords: childKeywords } = childProps;

        const newProps = {
            ...childProps,
            extension,
            icon: childIcon,
            name: childName ? `${title}-${childName}` : childName,
            keywords: childKeywords?.map(keyword => `${title}-${keyword}`) || []
        };

        if (topics) {
            const topicKeywords = topics.map(topic => topic.keyword);
            newProps.keywords = [...new Set([...newProps.keywords, ...topicKeywords])]; // Merge and remove duplicates
        }

        return React.cloneElement(child as React.ReactElement<BaseCommand>, newProps);
    };

    const enhancedChildren = React.Children.map(children, enhanceChild);

    return <>{enhancedChildren}</>;
};


// SimpleCommand 组件
interface SimpleCommandProps extends BaseCommand {
    handle: () => void;
    endAfterRun?: boolean;
}

const SimpleCommand: React.FC<SimpleCommandProps> = ({
    name,
    title,
    keywords,
    handle,
    icon,
    extension,
    endAfterRun,
}) => {
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

// PlaceholderCommand 组件
const PlaceholderCommand: React.FC = () => {
    return (
        <List.Item
            cls="!hidden"
            id={"placeholder"}
            key={"placeholder"}
            title={"placeholder"}
        />
    );
};

// 导出 CommandPanel 和 Command 组件
const Command = {
    SimpleCommand,
    PlaceholderCommand
};

export { Command, CommandPanel };
