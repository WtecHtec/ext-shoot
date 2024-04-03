/* eslint-disable react/no-unknown-property */

import {Command} from 'cmdk';

import React from 'react';

export default function Item({
                                 children,
                                 value,
                                 keywords,
                                 commandHandle,
                                 isCommand = false,
                                 cls = '',
                             }: {
    children: React.ReactNode
    value: string
    keywords?: string[]
    isCommand?: boolean
    commandHandle?: any
    cls?: string
}) {
    return (
        <Command.Item
            key={ value }
            className={ cls ? cls : '' }
            value={ value }
            keywords={ keywords }
            onSelect={ () => {
                typeof commandHandle === 'function' && commandHandle();
            } }>
            { children }
            <span cmdk-raycast-meta="" style={{ flexShrink: 0}}>{ isCommand ? 'Command' : 'Extension' }</span>
        </Command.Item>
    );
}
