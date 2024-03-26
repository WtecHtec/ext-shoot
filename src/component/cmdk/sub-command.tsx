import * as Popover from '@radix-ui/react-popover';
import { Command } from "cmdk";

import React from 'react';
import SubItem from './sub-item';

import EventBus from '~utils/event-bus';
import { getMutliLevelProperty } from '~utils/util';

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
	includeCommands = [],
}: {
	inputRef: React.RefObject<HTMLInputElement>
	listRef: React.RefObject<HTMLElement>
	selectName?: string
	onClickItem?: any,
	subCommands?: any
	includeCommands?: any,
}) {

	const [open, setOpen] = React.useState(false);
	const subCommandInputRef = React.useRef<HTMLInputElement>(null);
	const [refresh, setRefresh] = React.useState(0);

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setRefresh(Math.random());
		}, 300);
		return () => {
			clearTimeout(timer);
		};
	}, [open]);

	React.useEffect(() => {
    function inputListener (event) {
      if ([27,37,38,39,40].includes(event.keyCode)) return;
      // 阻止事件冒泡
      event.stopPropagation();
    }
		if (subCommandInputRef.current && open) {
			subCommandInputRef.current.autofocus = true;
			subCommandInputRef.current.focus();
      subCommandInputRef?.current?.addEventListener('keydown', inputListener);
		}
    return () => {
      if (subCommandInputRef &&  subCommandInputRef.current) {
        subCommandInputRef?.current?.removeEventListener('keydown', inputListener);
      }
    };
	}, [refresh, subCommandInputRef, open]);

	React.useEffect(() => {
		function listener(e: KeyboardEvent) {
			if (e.key.toLocaleUpperCase() === 'K' && e.metaKey) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		}
    function escClose(state) {
      const dialogs = getMutliLevelProperty(state, 'dialogs',  []);
      if (dialogs.length && dialogs[dialogs.length - 1] === 'sub_command') {
        eventBus.dispath('closeSubCommand');
        setOpen(false);
      }
    }
    eventBus.on('close', escClose);
		return () => {
			document.removeEventListener('keydown', listener);
      eventBus.off('close', escClose);
		};
	}, []);

	React.useEffect(() => {
		const el = listRef.current;

		if (!el) return;

		if (open) {
      eventBus.dispath('openSubCommand');
			el.style.overflow = 'hidden';
			el.style.pointerEvents = 'none';
      const rootEl = document.querySelector(`div[data-radix-popper-content-wrapper]`);
      console.log('rootEl---', rootEl);
		} else {
      eventBus.dispath('closeSubCommand');
			el.style.overflow = '';
			el.style.pointerEvents = 'all';
		}
	}, [open, listRef]);

	return (
		<Popover.Root open={open} onOpenChange={setOpen} modal>
			<Popover.Trigger
				cmdk-raycast-subcommand-trigger=""
				onClick={() => setOpen(true)}
				aria-expanded={open}>
				Actions
				<kbd>⌘</kbd>
				<kbd>K</kbd>
			</Popover.Trigger>
			<Popover.Content
				side="top"
				align="end"
				className="raycast-submenu"
				sideOffset={16}
				alignOffset={0}
				onCloseAutoFocus={(e) => {
					e.preventDefault();
					inputRef?.current?.focus();
				}}>
				<Command>
					<div className={'sub_command_title'}>{selectName}</div>
					<Command.List>
						<Command.Empty>No Results</Command.Empty>
						{subCommands.filter(({value}) => {
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
							group?.children.length ? <Command.Group key={group.key}
								style={{ overflow: 'auto' }}>
								{group.children.map((item) => (
									<SubItem
										key={item.value}
										value={item.value}
										style={{
											color: item.group === 'danger' ? 'red' : '',
										}}
										keywords={item.keywords}
										shortcut={item.shortcut}
										commandHandle={(value) => {
                      setOpen(v => !v);
											typeof onClickItem === 'function' && onClickItem(value);
                    }}>
										{item.icon}
										{item.name}
									</SubItem>
								))}
							</Command.Group>
							: null
						))}
					</Command.List>

					<Command.Input
						autoFocus
						ref={subCommandInputRef}
						placeholder="Search for actions..."
						tabIndex={-2}
						id="subCommandInput"
					/>
				</Command>
			</Popover.Content>
		</Popover.Root>
	);
}
