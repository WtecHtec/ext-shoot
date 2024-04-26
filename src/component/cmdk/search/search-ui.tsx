import React, { useEffect, useState } from 'react';
import { searchManager } from './search-manager';
import { BackIcon } from '~component/icons';
import { Command } from 'cmdk';

const SearchComponent = ({ inputRef }: { inputRef: React.RefObject<HTMLInputElement> }) => {
    const [search, setSearch] = useState(searchManager.content);
    const [placeholder] = useState(searchManager.placeholderText);
    const [inApp, setInApp] = useState<boolean>(searchManager.ifInApp);

    useEffect(() => {
        // 使用新的接口调用方式
        const unsubscribe = searchManager.subscribe(({ search, inApp }) => {
            setSearch(search);
            setInApp(inApp);
        });

        return unsubscribe; // Cleanup on unmount
    }, []);

    const handleSearchChange = (value: string) => {
        searchManager.setSearch(value);
    };

    const handleInAppChange = (value:boolean) =>{
        searchManager.setInApp(value);
    };

    const exitAppMode = ()=>{
        handleInAppChange(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (inApp) {
            if (event.key === 'Backspace' && search === '') {
                console.log("Backspace pressed with no content in in-app mode.");
                exitAppMode();
                event.stopPropagation();
            } else if (event.key === 'Escape') {
                console.log("Escape pressed in in-app mode.");
                exitAppMode();
                event.stopPropagation();
            }
        }
        
        if ([27, 37, 38, 39, 40, 13].includes(event.keyCode)
            || (event.metaKey && event.key.toLocaleUpperCase() === 'K')) {
            return;
        }

        if (event.metaKey) return;
        
        event.stopPropagation();
    };
    return (
        <div className='flex items-center justify-center'>
            {inApp && <BackIcon className='w-5 ml-4' />}
            <Command.Input
                value={search}
                onValueChange={handleSearchChange}
                onKeyDown={handleKeyDown}
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
