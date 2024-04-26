import { Command } from 'cmdk';
import React from 'react';


function StoreSearch() {
    return (
            <Command.List>
                <Command.Item
                    key = 'test 1'
                    keywords={['chrome', 'store', '']}
                    onSelect={() => { console.log('Search Chrome Store'); }}>test 1</Command.Item>
                <Command.Item
                    key = 'test 2'
                    keywords={['chrome', 'store', 'search']}
                    onSelect={() => { console.log('Search Chrome Store'); }}>test 2</Command.Item>
                <Command.Item
                    key = 'test 3'
                    keywords={['chrome', 'store', 'search']}
                    onSelect={() => { console.log('Search Chrome Store'); }}>test 3</Command.Item>
            </Command.List>
    );
}


const meta = {
    name: 'Store Search',
    App: StoreSearch,
};

export default meta;
