/* eslint-disable react/no-unknown-property */

import { Command } from 'cmdk';

import React, { useEffect } from 'react';
import { ExtensionIcon } from '~component/icons';
import { DEFAULT_AUTHOR } from '../core/constant';
import { actionManager } from '../action';

interface ListItemProps {
    id: string;
    title: string;
    subtitle?: string;
    keywords?: string[];
    type?: string;
    author?: string;
    actions?: React.ReactNode;
    icon?: string | React.ReactNode;
    children?: React.ReactNode;
    onSelect?: any;
    cls?: string;
}

export function Item({
    id,
    title,
    author,
    type,
    icon,
    actions,
    children,
    keywords,
    onSelect,
    cls = '',
}: ListItemProps) {

    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'string') {
            return <ExtensionIcon base64={icon} />;
        }
        if (React.isValidElement(icon)) {
            return icon;
        }
    };

    const renderAuthor = () => {
        if (!author) return DEFAULT_AUTHOR;
        return author;
    };

    const renderKind = () => {
        if (!type) return 'Command';
        return type;
    };

    const handleSelect = () => {
        typeof onSelect === 'function' && onSelect();
    };

    const registerActionPanel = () => {
        actionManager.registerAction(id, actions);
        actionManager.logAllActions();
    };
    useEffect(() => {
        registerActionPanel();
    }, []);

    return (
        <Command.Item
            className={cls ? cls : ''}
            value={id}
            keywords={keywords}
            onSelect={() => {
                handleSelect();
            }}>
            {renderIcon()}
            <div>
                <h3>{title}</h3>
                {/* <p>{item.description}</p> */}
            </div>
            {children}
            <span cmdk-raycast-sub="" style={{ flexShrink: 0 }}> {renderAuthor()}</span>
            <span cmdk-raycast-meta="" style={{ flexShrink: 0 }}> {renderKind()}</span>
        </Command.Item>
    );
}

const List = { Item };

export default List;
