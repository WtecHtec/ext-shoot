import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import SelectItem from "./select-item";
import { getId, getMutliLevelProperty } from "~utils/util";
import EventBus from '~utils/event-bus';

const eventBus = EventBus.getInstace();

export default function SnapshotDialog({
	snapOpen,
	container,
	onSnapChange,
	listRef,
	snapshots = [],
	onSvaeSnap = null,
}: {
	snapOpen: boolean,
	container?: HTMLElement,
	onSnapChange?: any,
	snapshots?: any,
	onSvaeSnap?: any,
	listRef: React.RefObject<HTMLElement>
}) {
	const [open, setOpen] = React.useState(false);
	const [selectContainer, setSelectContainer] = React.useState(null);
	const [snapName, setSnapName] = React.useState('Snapshot 1');
	const [tabValue, setTabValue] = React.useState('add');
	const [snapId, setSnapId] = React.useState('');
	const subCommandInputRef = React.useRef<HTMLInputElement>();
	const [refresh, setRefresh] = React.useState(0);
	React.useEffect(() => {
		setOpen(snapOpen);
    eventBus.dispath(snapOpen ? 'openSnap' : 'closeSnap');
		const timer = setTimeout(() => {
			setRefresh(Math.random());
		}, 300);
		return () => {
			clearTimeout(timer);
		};
	}, [snapOpen]);

  React.useEffect(() => {
    function escClose(state) {
      const dialogs = getMutliLevelProperty(state, 'dialogs', []);
      if (dialogs.length && dialogs[dialogs.length - 1] === 'snap_dialog') {
        eventBus.dispath('closeSnap');
        setOpen(false);
				typeof onSnapChange === 'function' && onSnapChange(false);
      }
    }
    eventBus.on('close', escClose);
    return () => {
      eventBus.off('close', escClose);
    };
	}, []);
  

	React.useEffect(() => {
    function inputListener (event) {
			if ([27, 37, 38, 39, 40, 13,].includes(event.keyCode)) return;
      // 阻止事件冒泡
      event.stopPropagation();
    }
		if (subCommandInputRef.current && open) {
			subCommandInputRef.current.autofocus = true;
			subCommandInputRef.current.focus();
      subCommandInputRef?.current?.addEventListener('keydown', inputListener);
		}
		const el = listRef?.current;
		if (open) {
			el.style.overflow = 'hidden';
			el.style.pointerEvents = 'none';
		} else {
			el.style.overflow = '';
			el.style.pointerEvents = 'all';
		}
    return () => {
      if (subCommandInputRef &&  subCommandInputRef.current) {
        subCommandInputRef?.current?.removeEventListener('keydown', inputListener);
      }
    };
	}, [refresh, subCommandInputRef, open, listRef]);

	const onOpenChange = (v) => {
		setOpen(v);
		typeof onSnapChange === 'function' && onSnapChange(v);
	};
	const onInput = (e) => {
		setSnapName(e.target.value);
	};
	const onSave = () => {
		if (snapName.trim().length < 2) return;
    setOpen(false);
		typeof onSvaeSnap === 'function' &&
			onSvaeSnap(tabValue, snapId, snapName.trim());
	};
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
			<Dialog.Portal container={container}>
				<Dialog.Overlay className="DialogOverlay" />
				<Dialog.Content className="DialogContent">
					<Tabs.Root
						className="TabsRoot"
						defaultValue={tabValue}
						value={tabValue}
						onValueChange={setTabValue}>
						<Tabs.List className="TabsList" aria-label="Manage your account">
							<Tabs.Trigger className="TabsTrigger" value="add">
								Add
							</Tabs.Trigger>
							<Tabs.Trigger className="TabsTrigger" value="replace">
								Replace
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content className="TabsContent" value="add">
							<p className="Text">Create new snapshot</p>
							<fieldset className="Fieldset">
								<input
									ref={subCommandInputRef}
									autoFocus
									placeholder="snapshot name (min len 2)"
									minLength={2}
									maxLength={12}
									className="Input"
									value={snapName}
									onInput={onInput}
								/>
							</fieldset>
						</Tabs.Content>
						<Tabs.Content className="TabsContent" value="replace">
							<p className="Text">Replace a snapshot</p>
							<Select.Root value={snapId} onValueChange={setSnapId}>
								<Select.Trigger className="SelectTrigger"
									aria-label="Food">
									<Select.Value
										placeholder={
											snapshots.length > 0
												? 'Select a Snapshot'
												: 'Snapshot Empty'
										}
									/>
									<Select.Icon className="SelectIcon">
										<ChevronDownIcon />
									</Select.Icon>
								</Select.Trigger>
								<Select.Portal container={selectContainer}>
									<Select.Content className="SelectContent">
										{snapshots.length > 0
											? snapshots.map(({ id, name }) => (
												<SelectItem key={id} value={id || getId()}>{name}</SelectItem>
											))
											: null}
									</Select.Content>
								</Select.Portal>
							</Select.Root>
							<div
								className="container-root"
								style={{
									width: '100%',
									boxSizing: 'border-box',
									position: 'relative',
								}}
								ref={setSelectContainer}></div>
						</Tabs.Content>
					</Tabs.Root>
					<div
						style={{
							display: 'flex',
							marginTop: 25,
							justifyContent: 'flex-end',
						}}>
						<button className="Button green" onClick={onSave}>
							Save
						</button>
					</div>
					<Dialog.Close asChild>
						<button className="IconButton" aria-label="Close">
							<Cross2Icon></Cross2Icon>
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}