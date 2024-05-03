import { Command } from "cmdk";
import React from "react";
import { CopyNameIcon, ExtensionIcon, StoreIcon } from "~component/icons";
import { ShortCutKBD, Shortcut } from "./ShortCut";

interface ActionPanelProps {
    value: string;
    keywords: string[];
    onSelect: () => void;
    icon?: string | React.ReactNode;
    children?: React.ReactNode;
    cls?: string;
    Shortcut?: Shortcut;
}

const BaseAction = (
    {
        value,
        keywords,
        onSelect,
        Shortcut,
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
    const renderShortcut = () => {
        return (
            <div cmdk-motionshot-submenu-shortcuts="">
                {Shortcut
                    ? <ShortCutKBD
                        Shortcut={{
                            key: Shortcut.key,
                            modifiers: Shortcut.modifiers
                        }}
                    />
                    : null}
            </div>
        );
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
        {renderShortcut()}
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
    shortcut?: Shortcut;
}
const CopyToClipboard = (
    {
        content,
        title,
        shortcut
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
            Shortcut={shortcut}
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
