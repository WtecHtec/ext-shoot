import * as Popover from '@radix-ui/react-popover';
import {Command} from 'cmdk';

import React from 'react';
import SubItem from './sub-item';

import EventBus from '~utils/event-bus';
import {getMutliLevelProperty} from '~utils/util';
import {ExtShootSeverHost} from '~config/config';
import axios from 'axios';
import {GlobeIcon} from '~component/icons';
import {handleCreateTab} from '~utils/management';
import { getExtId } from '~lib/util';

const eventBus = EventBus.getInstace();
const BASE_SUB_GROUP = () => [
    {
        name: 'common',
        key: 'common',
        children: [],
    },
    {
        name: 'dev',
        key: 'dev',
        children: [],
    },
    {
        name: 'danger',
        key: 'danger',
        children: [],
    },
];

export default function SubCommand({
                                       inputRef,
                                       listRef,
                                       selectName,
                                       onClickItem,
                                       subCommands,
                                       extShootRef,
                                       value,
                                       includeCommands = [],
                                   }: {
    inputRef: React.RefObject<HTMLInputElement>
    listRef: React.RefObject<HTMLElement>
    extShootRef: React.RefObject<HTMLElement>
    selectName?: string
    onClickItem?: any,
    subCommands?: any
    includeCommands?: any,
    value?: any
}) {

    const [open, setOpen] = React.useState(false);
    const subCommandInputRef = React.useRef<HTMLInputElement>(null);
    const [refresh, setRefresh] = React.useState(0);
    const [pageDatas, setPageDatas] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setRefresh(Math.random());
        }, 300);
        return () => {
            clearTimeout(timer);
        };
    }, [open]);

    const getExtPages = (extInfo) => {
        const { id, name } = extInfo;
        const formatId = getExtId(id);
        axios.post(`${ ExtShootSeverHost }/pages`, {
            extId: formatId,
            name: encodeURIComponent(name),
        })
            .then(response => {
                const pages = getMutliLevelProperty(response, 'data.pages', []);
                const resluts = pages.map(element => {
                    return ({
                        value: element.path,
                        shortcut: '',
                        keywords: [element.path, ...(element.path.split('/'))],
                        name: element.path,
                    });
                });
                setPageDatas(resluts);
            })
            .catch(error => {
                console.error(error);
            });
        setLoading(false);
    };
    React.useEffect(() => {
        if (!open) return;
        const isCommand = getMutliLevelProperty(value, 'isCommand', true);
        const id = getMutliLevelProperty(value, 'id', '');
        if (!value && isCommand || !id ) return;
        setLoading(true);
        getExtPages(value);
    }, [value, open]);

    const gotoPage = async (path) => {
        console.log('value----', value);
        const formatId = getExtId(value.id);
        // window.open(`chrome-extension://${value.id}${path}`);
        await handleCreateTab(`chrome-extension://${ formatId }${ path }`);
        setOpen(false);
    };
    React.useEffect(() => {
        function inputListener(event) {
            if ([27, 37, 38, 39, 40, 13].includes(event.keyCode)
                || (event.metaKey && event.key.toLocaleUpperCase() === 'K')) return;
            if (event.metaKey) return;
            // 阻止事件冒泡
            event.stopPropagation();
        }

        if (subCommandInputRef.current && open) {
            subCommandInputRef.current.autofocus = true;
            subCommandInputRef.current.focus();
            subCommandInputRef?.current?.addEventListener('keydown', inputListener);
        }
        return () => {
            if (subCommandInputRef && subCommandInputRef.current) {
                subCommandInputRef?.current?.removeEventListener('keydown', inputListener);
            }
        };
    }, [refresh, subCommandInputRef, open]);

    React.useEffect(() => {
        const el = extShootRef.current;

        function listener(e: KeyboardEvent) {
            if (e.key.toLocaleUpperCase() === 'K' && e.metaKey) {
                e.preventDefault();
                setOpen((o) => !o);
                e.stopPropagation();
            }
        }

        function escClose(state) {
            const dialogs = getMutliLevelProperty(state, 'dialogs', []);
            if (dialogs.length && dialogs[dialogs.length - 1] === 'sub_command') {
                eventBus.dispath('closeSubCommand');
                setOpen(false);
            }
        }

        el && el.addEventListener('keydown', listener);
        eventBus.on('close', escClose);
        return () => {
            el && el.removeEventListener('keydown', listener);
            eventBus.off('close', escClose);
        };
    }, [extShootRef]);

    React.useEffect(() => {
        const el = listRef.current;

        if (!el) return;

        if (open) {
            eventBus.dispath('openSubCommand');
            el.style.overflow = 'hidden';
            el.style.pointerEvents = 'none';
        } else {
            eventBus.dispath('closeSubCommand');
            el.style.overflow = '';
            el.style.pointerEvents = 'all';
        }
    }, [open, listRef]);

    return (
        <Popover.Root open={ open } onOpenChange={ setOpen }>
            <Popover.Trigger
                cmdk-raycast-subcommand-trigger=""
                onClick={ () => setOpen(true) }
                aria-expanded={ open }>
                Actions
                <kbd>⌘</kbd>
                <kbd>K</kbd>
            </Popover.Trigger>
            <Popover.Content
                side="top"
                align="end"
                className="raycast-submenu"
                sideOffset={ 16 }
                alignOffset={ 0 }
                onCloseAutoFocus={ (e) => {
                    e.preventDefault();
                    inputRef?.current?.focus();
                } }>
                <Command>
                    <div className={ 'sub_command_title' }>{ selectName }</div>
                    <Command.List>
                        <Command.Empty>No Results</Command.Empty>
                        { subCommands.filter(({ value }) => {
                            if (Array.isArray(includeCommands) && includeCommands.length) {
                                return includeCommands.includes(value);
                            }
                            return true;
                        }).reduce((groups, item) => {
                            const group = groups.find((group) => group.name === item.group);
                            if (group) {
                                group.children.push(item);
                            } else {
                                groups.push({
                                    name: item.group,
                                    key: item.group.toLowerCase(),
                                    children: [item],
                                });
                            }
                            return groups;
                        }, BASE_SUB_GROUP()).map((group) => (
                            group?.children.length ? <Command.Group key={ group.key }
                                                                    style={ { overflow: 'auto' } }>
                                    { group.children.map((item) => (
                                        <SubItem
                                            key={ item.value }
                                            value={ item.value }
                                            style={ {
                                                color: item.group === 'danger' ? 'red' : '',
                                            } }
                                            keywords={ item.keywords }
                                            shortcut={ item.shortcut }
                                            commandHandle={ (value) => {
                                                setOpen(v => !v);
                                                typeof onClickItem === 'function' && onClickItem(value);
                                            } }>
                                            { item.icon }
                                            { item.name }
                                        </SubItem>
                                    )) }
                                </Command.Group>
                                : null
                        )) }

                        {
                            loading ?
                                <Command.Loading></Command.Loading> : (pageDatas.length ?
                                    <Command.Group heading={`Extension Pages (${pageDatas.length})`}>
                                        { pageDatas.map((item) => (
                                            <SubItem
                                                key={ item.value }
                                                value={ item.value }
                                                keywords={ item.keywords }
                                                shortcut={ item.shortcut }
                                                commandHandle={ () => {
                                                    setOpen(v => !v);
                                                    gotoPage(item.value);
                                                } }>
                                                <GlobeIcon></GlobeIcon>
                                                { item.name }
                                            </SubItem>
                                        )) }
                                    </Command.Group> : null)
                        }
                    </Command.List>

                    <Command.Input
                        autoFocus
                        ref={ subCommandInputRef }
                        placeholder="Search for actions..."
                        tabIndex={ -2 }
                        id="subCommandInput"
                    />
                </Command>
            </Popover.Content>
        </Popover.Root>
    );
}
