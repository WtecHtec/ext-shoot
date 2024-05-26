import React, { useEffect, useState } from 'react';
import { searchManager } from './search-manager';
import { BackIcon } from '~component/icons';
import { Command } from 'motion-cmdk';
import { appManager } from '../app/app-manager';
import { topicManager } from '../topic/topic-manager';
import TopicLabel from '../topic/topic-ui';

const SearchComponent = ({ inputRef }: { inputRef: React.RefObject<HTMLInputElement> }) => {
    const [search, setSearch] = useState(searchManager.content);
    const [placeholder] = useState(searchManager.placeholderText);
    const [inApp, setInApp] = useState<boolean>(appManager.ifInApp);
    const [activeTopics, setActiveTopics] = useState(topicManager.activeTopics);
    useEffect(() => {
        // 使用新的接口调用方式
        const unsubscribe = searchManager.subscribe(({ search }) => {
            setSearch(search);
        });
        return unsubscribe; // Cleanup on unmount
    }, []);


    useEffect(() => {
        // 使用新的接口调用方式
        const unsubscribe = appManager.subscribe(({ inAppMode }) => {
            setInApp(inAppMode);
        });
        return unsubscribe; // Cleanup on unmount
    }, []);

    useEffect(() => {
        // 使用新的接口调用方式
        const unsubscribe = topicManager.subscribe(({ activeTopics }) => {
            setActiveTopics(activeTopics);
        });
        return unsubscribe; // Cleanup on unmount
    }, []);


    const handleSearchChange = (value: string) => {
        searchManager.setSearch(value);
    };

    const exitAppMode = () => {
        appManager.exitApp();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        const isMetaK = event.metaKey && key.toUpperCase() === 'K';
        const navigationKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Enter'];
        const isCtrlK = event.ctrlKey && key.toUpperCase() === 'K'; // 上下
        const isCtrlJ = event.ctrlKey && key.toUpperCase() === 'J';
        // 特殊键直接返回
        if (isMetaK || navigationKeys.includes(key)) {
            return;
        }

        // 特殊键直接返回
        if (isCtrlK || isCtrlJ || isMetaK || navigationKeys.includes(key)) {
            return;
        }

        // 在应用内的操作
        if (inApp) {
            if ((key === 'Backspace' && search === '') || key === 'Escape') {
                console.log(`${key} pressed with no content in in-app mode.`);
                exitAppMode();
                event.stopPropagation();
                return;
            }
        } else if (!inApp && key === 'Backspace' && search === '' && topicManager.hasActiveTopic) {
            // 不在应用内且有活动主题时清除主题
            topicManager.clearActiveTopics();
            event.stopPropagation();
            return;
        }

        // 如果使用了 meta 键，则不继续传播事件
        if (event.metaKey || key === 'Escape') return;


        // 对所有处理的键盘事件阻止冒泡 
        event.stopPropagation();
    };
    return (
        <div className='flex items-center justify-center'>
            {inApp && <BackIcon className='w-5 ml-4' />}
            {!inApp &&
                activeTopics.map((topic) => {
                    return (
                        <TopicLabel key={topic.id} topic={topic} />
                    );
                })
            }
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
