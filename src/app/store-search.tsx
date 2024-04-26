import { Command } from 'cmdk';
import React from 'react';


function StoreSearch() {
    return (
        <div>
            <Command.List>
                <Command.Item
                    keywords={['chrome', 'store', 'search']}
                    onSelect={() => { console.log('Search Chrome Store'); }}>test xxxxx</Command.Item>
                <Command.Item
                    keywords={['chrome', 'store', 'search']}
                    onSelect={() => { console.log('Search Chrome Store'); }}>test xxxxx</Command.Item>
                <Command.Item
                    keywords={['chrome', 'store', 'search']}
                    onSelect={() => { console.log('Search Chrome Store'); }}>test xxxxx</Command.Item>
            </Command.List>
        </div>
    );
}


const meta = {
    name: 'Store Search',
    App: StoreSearch,
};

export default meta;
