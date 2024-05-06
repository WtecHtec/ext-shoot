
import { ExtensionLauncher, ExtensionManagerCommand } from '~extension';
import React, { useEffect, useState } from 'react';
import { Command } from '../common/Command';
import { searchManager } from '../search/search-manager';


import { Command as CommandCMDK } from 'cmdk';
import ChromeStoreWebSearch from '~extension/chrome-store-web-search';
import InstantOpen from '~extension/instant-open';
import ChromeStoreSearch from '~extension/chrome-store-search';
import HistorySearch from '~extension/history-search';

function ExtensionWithSearchLoader() {
    const [search, setSearch] = useState(searchManager.content);
    useEffect(() => {
        const unsubscribe = searchManager.subscribe(
            ({ search }) => {
                setSearch(search);
            },
            {
                target: ["search"]
            }
        );
        return unsubscribe; // Cleanup on unmount
    }, []);

    return (
        search &&
        <CommandCMDK.Group heading={`Use "${search}" with ... `}>
            <HistorySearch search={search}></HistorySearch>
            <ChromeStoreSearch search={search}></ChromeStoreSearch>
            <ChromeStoreWebSearch search={search}></ChromeStoreWebSearch>
            <InstantOpen search={search}></InstantOpen>
        </CommandCMDK.Group>
    );
}

const ExtensionLoader = () => {
    return (
        <>
            <Command.PlaceholderCommand />
            <ExtensionLauncher />
            <ExtensionManagerCommand />
        </>
    );
};

const CommandUI = () => {

    return (
        <>
            <ExtensionLoader />
            <ExtensionWithSearchLoader />
        </>
    );
};

export {
    CommandUI
};