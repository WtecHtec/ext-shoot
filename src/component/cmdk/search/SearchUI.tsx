import React, { useEffect, useState } from 'react';
import { searchManager } from './SearchManager';
import { BackIcon } from '~component/icons';
import { Command } from 'cmdk';

const SearchComponent = ({ inputRef }: { inputRef: React.RefObject<HTMLInputElement> }) => {
    const [search, setSearch] = useState(searchManager.content);
    const [placeholder] = useState(searchManager.placeholderText);

    useEffect(() => {
        const unsubscribe = searchManager.subscribe((newSearch) => {
            setSearch(newSearch);
        });
        return unsubscribe; // Cleanup on unmount
    }, []);

    const handleSearchChange = (value) => {
        searchManager.setSearch(value);
    };

    return (
        <div className='flex items-center justify-center'>
            <BackIcon className='w-5 ml-4' />
            <Command.Input
                value={search}
                onValueChange={handleSearchChange}
                ref={inputRef}
                autoFocus
                placeholder={placeholder}
                style={{ flex: 1 }}
                tabIndex={-2}
            />
        </div>
    );
};

export default SearchComponent;
