import { Command } from "cmdk";
import React from "react";
import { CopyNameIcon, ExtensionIcon, StoreIcon } from "~component/icons";

interface ActionPanelProps {
    value: string;
    keywords: string[];
    onSelect: () => void;
    icon?: string | React.ReactNode;
    children?: React.ReactNode;
    cls?: string;
}

const BaseAction = (
    {
        value,
        keywords,
        onSelect,
        icon,
        cls = '',
    }: ActionPanelProps

) => {
    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'string') {
            return <ExtensionIcon base64={icon} />;
        }
        if (React.isValidElement(icon)) {
            return icon;
        }
    };

    const handleSelect = () => {
        typeof onSelect === 'function' && onSelect();
    };

    const renderValue = () => {
        return value;
    };
    return <Command.Item
        className={cls ? cls : ''}
        value={value}
        keywords={keywords}
        onSelect={() => {
            handleSelect();
        }}>
        {renderIcon()}
        {renderValue()}
    </Command.Item >;

};

interface OpenInBrowserProps {
    url: string;
    title?: string;
}
const OpenInBrowser = (
    {
        title,
        url
    }: OpenInBrowserProps

) => {
    if (!title) {
        title = 'Open in Browser';
    }
    return (
        <BaseAction
            value={title}
            keywords={['open', 'browser']}
            icon={<StoreIcon />}
            onSelect={() => {
                window.open(url);
            }}
        />
    );
};


interface CopyToClipboardProps {
    content: string;
    title?: string;
    shortcut?: string;
}
const CopyToClipboard = (
    {
        content,
        title,
    }: CopyToClipboardProps
) => {
    if (!title) {
        title = 'Copy to Clipboard';
    }
    return (
        <BaseAction
            value={title}
            keywords={['copy', 'clipboard']}
            icon={<CopyNameIcon />}
            onSelect={() => {
                navigator.clipboard.writeText(content);
            }}
        />
    );
};


const Action = {
    BaseAction,
    OpenInBrowser,
    CopyToClipboard,
};


export { Action };