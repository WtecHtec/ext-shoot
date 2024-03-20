import * as Popover from "@radix-ui/react-popover"
import { Command } from "cmdk"
import React, { useEffect, useState } from "react"

import { AC_ICON_UPDATED } from "~config/actions"
import { ActionMeta, SUB_ITME_ACTIONS } from "~utils/actions"
import { getExtensionAll, handleCreateSnapshots, handleExtFavoriteDone, handleExtUpdateDone, handleGetSnapshots, handleOpenExtensionDetails, handleOpenRecently, handlePluginStatus, handleUninstallPlugin } from "~utils/management"

import {
	ClipboardIcon,
	ExtensionIcon,
	FinderIcon,
	HammerIcon,
	Logo,
	RaycastIcon,
	ShootIcon,
	StarIcon,
	UpdateInfoIcon,
	WindowIcon
} from "../icons"

import { LineSpinnerIcon } from "../icons"
import { toast } from 'sonner/dist'
import classnames from 'classnames';
import { Cross2Icon, ChevronDownIcon, CheckIcon, ChevronUpIcon } from '@radix-ui/react-icons';

import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import { getId } from "~utils/util"
import * as clipboard from 'clipboard-polyfill';
import axios from 'axios'

const RecentlyFix = 'recently_'
const MarkId = '@_'


const handleDoExt = (extInfo) => {
	const { id, recently } = extInfo
	if (id.includes(RecentlyFix) && recently && recently.pendingUrl) {
		handleOpenRecently(recently.pendingUrl)
	} else {
		handleOpenExtensionDetails(getExtId(id))
	}
}


const getExtId = (id) => {
	const ids = id?.split(MarkId)
	return ids[ids.length - 1];
}

const BASE_GROUP = () => [
	{
		name: 'Recently Accessed',
		key: 'recently',
		children: [],
	},
	{
		name: 'Favorite',
		key: 'favorite',
		children: [],
	},
	{
		name: 'Development',
		key: 'development',
		children: [],
	},
]
export function RaycastCMDK() {
	const [value, setValue] = React.useState("")
	const [extDatas, setExtDatas] = React.useState([]) // 页面显示数据
	const [originDatas, setOriginDatas] = React.useState([]) // 扩展源数据, 全部
	const [updateStatus, setHasUpdateStatus] = React.useState(0) // 0:无更新；1:有更新；2:更新中
	const [selectSnapId, setSelectSnapId] = React.useState('all'); // 快照id
	const [snapshots, setSnapshots] = React.useState([]) // 快照数据
	const [loaded, setLoaded] = React.useState(false)
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const listRef = React.useRef(null)
	const [search, setSearch] = useState(null)
	const [container, setContainer] = React.useState(null);
	const [selectContainer, setSelectContainer] = React.useState(null);
	const [snapshotOpen, setSnapshotOpen] = React.useState(false);
	// const inputRef = React.useRef<HTMLInputElement | null>(null)
	/**
	 * 获取插件数据
	 * id: {
	 * 	group: ,
	 *  favorite:
	 * }
	 * groups: [
	 *  {
	 * 	 name: 'Favorite'
	 * 	},
	 * 	{
	 * 		name: 'Development'
	 *  }
	 *  {
	 *   name: 'All'
	 *  }
	 * ]
	 * @returns
	 */
	const getExtensionDatas = async () => {
		console.log('获取插件数据')
		const [err, res] = await getExtensionAll()
		if (err || !Array.isArray(res)) {
			return
		}
		const shotDatas = await getSnapShotDatas()
		const [groups] = formatExtDatas(res, shotDatas, selectSnapId)
		setOriginDatas(res)
		setExtDatas(groups)
		setHasUpdateStatus(checkUpdate(res) ? 1 : 0);
		setLoaded(res.length > 0)
	}

	/** 判断 loadedicon 状态 */
	const checkUpdate = (exts) => {
		return !!exts.find(({ loadedicon }) => !loadedicon)
	}

	/** 处理分组数据, 切换快照时，可不需请求 */
	const formatExtDatas = (exts, shotDatas, selectSnapId,) => {
		const currentSnap = shotDatas.find(({ id }) => id === selectSnapId)
		const groups = [...BASE_GROUP(),]
		let currExts = []
		exts.sort((a, b) => b.enabled - a.enabled).forEach(item => {
			const { installType, favorite, recently } = item as ExtItem
			if (recently && recently.pendingUrl) {
				groups[0].children.push({
					...item,
					id: `${RecentlyFix}${MarkId}${item.id}`
				})
			}
			if (favorite) {
				groups[1].children.push({
					...item,
					id: `${groups[1].key}${MarkId}${item.id}`
				})
			}
			if (installType === 'development') {
				groups[2].children.push({
					...item,
					id: `${groups[2].key}${MarkId}${item.id}`
				})
			}
			if (currentSnap && Array.isArray(currentSnap.extIds) && currentSnap.extIds.includes(item.id)) {
				currExts.push({
					...item
				})
			}
		})

		if (selectSnapId === 'all') {
			groups.push({
				name: 'All',
				key: 'all',
				children: [...exts],
			});
		} else if (currExts.length && currentSnap) {
			groups.push({
				name: currentSnap.name,
				key: currentSnap.id,
				children: [...currExts],
			});
		}
		groups[0].children.sort((a, b) => b?.recently.lastTime - a?.recently.lastTime).slice(0, 7)
		return [groups]
	}

	/** 触发按键 */
	React.useEffect(() => {
		async function listener(e: KeyboardEvent) {
			const key = e.key?.toUpperCase()

			if (key === "F" && e.shiftKey && e.metaKey) {
				// 收藏
				e.preventDefault()
				onHandelFavorite()
			} else if (key === 'U' && e.metaKey) {
				// 更新
				e.preventDefault()
				onHandleUpdate()
			} else if (key === "F" && e.shiftKey) {
				// 快照
				e.preventDefault()
				setSnapshotOpen(v => !v)
			} else if (e.metaKey && key === '.') {
				// 复制插件名字
				e.preventDefault()
				onHandleCopyName()
			} else if (e.shiftKey && e.metaKey && key === 'C') {
				// 复制插件名字
				e.preventDefault()
				onHandleCopyPluginId()
			} else if (e.shiftKey && e.metaKey && key === 'D') {
				e.preventDefault()
				onHanldePulginStatus(false)
			} else if (e.shiftKey && e.metaKey && key === 'S') {
				e.preventDefault()
				onHanldePulginStatus(true)
			} else if (e.shiftKey && e.metaKey && key === 'Q') {
				e.preventDefault()
				onHanldeUninstallPulgin()
			} else if (e.shiftKey && key === 'R') {
				e.preventDefault()
				onHandleReloadPlugin()
			} else if (e.metaKey && e.key === 'ENTER') {
				e.preventDefault()
				onHandleShowInFinder()
			}
		}
		document.addEventListener("keydown", listener)
		return () => {
			document.removeEventListener("keydown", listener)
		}
	}, [value, originDatas])

	React.useEffect(() => {
		inputRef?.current?.focus()
		getExtensionDatas()
		const handelMsgBybg = (request, sender, sendResponse) => {
			if (request.action === AC_ICON_UPDATED) {
				// 在这里处理接收到的消息
				setHasUpdateStatus(0)
				getExtensionDatas();
				// 发送响应
				sendResponse({ result: "Message processed in content.js" })
			}
		}
		chrome.runtime.onMessage.addListener(handelMsgBybg)
		return () => {
			chrome.runtime.onMessage.removeListener(handelMsgBybg)
		}
	}, [])

	// 当快照选择变化时，可以不需要重新请求接口
	useEffect(() => {
		const [groups] = formatExtDatas(originDatas, snapshots, selectSnapId)
		setExtDatas(groups)
	}, [selectSnapId])


	// 当搜索内容变化时，滚动到列表顶部
	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = 0 // 滚动到顶部
		}
	}, [search]) // 依赖search，当search变化时，执行effect

	const getExtensionDeatilById = (id: string) => {
		return originDatas.find((ext) => ext.id === getExtId(id))
	}
	/** 当前快照 启用的插件 */
	const onSvaeSnap = async (tab, snapId, name) => {
		try {
			let extIds = extDatas[extDatas.length - 1].children.filter(({ enabled }) => enabled === true);
			extIds = extIds.map(({ id }) => id);
			await handleCreateSnapshots(snapId, name, extIds)
			if (tab === 'add') {
				await getSnapShotDatas()
			} else if (tab === 'replace') {
				await getExtensionDatas()
			}
		} catch (error) {

		}
	}

	const getSnapShotDatas = async () => {
		const [err, res] = await handleGetSnapshots()
		if (err || !Array.isArray(res)) {
			return []
		}
		setSnapshots(res)
		return res
	}

	/**
	 * 更新
	 */
	const onHandleUpdate = () => {
		handleExtUpdateDone()
		setHasUpdateStatus(2)
		toast("Update Success")
	}

	/**
	 * 回车操作
	 * @returns 
	 */
	const onHandleOpenExt = () => {
		const extInfo = getExtensionDeatilById(value)
		if (!extInfo) {
			toast("It is not Extension")
			return
		}
		handleDoExt(extInfo)
	}

	/**
	 * 收藏操作
	 * @returns 
	 */
	const onHandelFavorite = async () => {
		const extDeatil = getExtensionDeatilById(value)
		if (!extDeatil) return
		if (listRef.current) {
			listRef.current.scrollTop = 0 // 滚动到顶部
		}
		const favorite = extDeatil?.favorite
		await handleExtFavoriteDone(value, !favorite)
		await getExtensionDatas();
		toast("Favorite Success")
	}

	/**
	 * 复制插件名字
	 */
	const onHandleCopyName = () => {
		const extInfo = getExtensionDeatilById(value)
		clipboard.writeText(extInfo.name);
		toast("Copy Name Success")
	}

	/**
	* 复制插件名字
	*/
	const onHandleCopyPluginId = () => {
		const extInfo = getExtensionDeatilById(value)
		clipboard.writeText(extInfo.id);
		toast("Copy Plugin ID Success")
	}

	/**
	 * 禁用、启用插件
	 * @param status 
	 */
	const onHanldePulginStatus = async (status) => {
		const extInfo = getExtensionDeatilById(value)
		await handlePluginStatus(extInfo.id, status)
		getExtensionDatas()
		toast(status ? "Enable Plugin Success" : "Disable Plugin Success")
	}

	/**
	 * 执行一次禁用、启用插件模拟刷新插件(开发状态)
	 */
	const onHandleReloadPlugin = async () => {
		const extInfo = getExtensionDeatilById(value)
		if (extInfo.installType === 'development') {
			await handlePluginStatus(extInfo.id, false)
			setTimeout(async () => {
				await handlePluginStatus(extInfo.id, true)
				getExtensionDatas()
				toast('Reload PluginSuccess')
			}, 2000)
		} else {
			toast('It is not Development')
		}
	}

	/**
	 * 打开插件文件夹路径
	 */
	const onHandleShowInFinder = () => {
		const extInfo = getExtensionDeatilById(value)
		const { installType, id, name } = extInfo
		axios.post('http://localhost:5698/submit', {
			extId: id,
			type: installType === 'development' ? 'development' : 'webstore',
			name: encodeURIComponent(name),
		})
			.then(response => {
				console.log(response.data);
				toast('Show In Finder PluginSuccess')
			})
			.catch(error => {
				console.error(error);
				toast('Show In Finder Error')
			});

	}

	/**
	 * 卸载
	 */
	const onHanldeUninstallPulgin = () => {
		const extInfo = getExtensionDeatilById(value)
		handleUninstallPlugin(extInfo.id)
	}
	/**
	 * SubCommand 点击操作 
	 */
	const onClickSubItem = (subValue) => {
		console.log('onClickSubItem ---', value)
		const extInfo = getExtensionDeatilById(value)
		if (!extInfo) {
			toast("It is not Extension")
			return
		}
		switch (subValue) {
			case 'open_extension_page':
				onHandleOpenExt();
				break
			case 'copy_plugin_name':
				onHandleCopyName();
				break
			case 'copy_plugin_id':
				onHandleCopyPluginId()
				break
			case 'open_snapshot_dialog':
				setSnapshotOpen(v => !v);
				break
			case 'add_to_favorites':
				onHandelFavorite()
				break
			case 'disable_plugin':
				onHanldePulginStatus(false)
				break
			case 'enable_plugin':
				onHanldePulginStatus(true)
				break
			case 'reload_plugin':
				onHandleReloadPlugin()
				break
			case 'show_in_finder':
				onHandleShowInFinder()
				break
			case 'uninstall_plugin':
				onHanldeUninstallPulgin()
				break
			default:
				toast("Try Other Actions")
		}
	}

	return (
		<div className="ext-shoot">
			<Command value={value} onValueChange={(v) => setValue(v)}>
				<div cmdk-raycast-top-shine="" />
				<div style={{ display: 'flex' }}>
					<Command.Input
						value={search}
						onValueChange={setSearch}
						ref={inputRef}
						autoFocus
						placeholder="Search for extensions and commands..."
						style={{ flex: 1 }}
					/>
					<div style={{ flexShrink: 0, marginLeft: '12px', position: 'relative', zIndex: 999 }}>
						<Select.Root value={selectSnapId} onValueChange={setSelectSnapId}>
							<Select.Trigger className="SelectTrigger" aria-label="Food">
								<Select.Value placeholder='Select a Snapshot' />
								<Select.Icon className="SelectIcon">
									<ChevronDownIcon />
								</Select.Icon>
							</Select.Trigger>
							<Select.Portal container={selectContainer}>
								<Select.Content className="SelectContent">
									<SelectItem value='all'>All</SelectItem>
									{
										snapshots.length > 0 ? snapshots.map(({ id, name }) => <SelectItem value={id || getId()}>{name}</SelectItem>) : null
									}
								</Select.Content>
							</Select.Portal>
						</Select.Root>
						<div className="container-root menu-main" style={{ width: '100%', boxSizing: 'border-box', position: 'relative' }} ref={setSelectContainer}></div>
					</div>
				</div>


				<hr cmdk-raycast-loader="" />
				<Command.List ref={listRef}>
					<Command.Empty>No results found.</Command.Empty>
					{
						extDatas.length > 0 ? extDatas?.map(({ children, name }) => {
							return <>
								{
									children && children.length > 0 ? <>
										<Command.Group heading={`${name}(${children.length})`}>
											{children?.map((item) => {
												const { id, name, icon, enabled } = item;
												return (
													<Item value={id} keywords={[name]} id={id} key={id} extinfo={item} cls={!enabled && 'grayscale'}>
														{icon ? (
															<ExtensionIcon base64={icon} />
														) : (
															<RaycastIcon></RaycastIcon>
														)}
														{name}
													</Item>
												)
											})
											}
										</Command.Group>
									</>
										: null
								}
							</>
						}) : null
					}
					{/* <Command.Group heading="Results">
						{extDatas.length > 0
							? extDatas?.map(({ id, name, icon }) => {
								return (
									<Item value={id} keywords={[name]} id={id} key={id}>
										{icon ? (
											<ExtensionIcon base64={icon} />
										) : (
											<RaycastIcon></RaycastIcon>
										)}
										{name}
									</Item>
								)
							})
							: null}
					</Command.Group> */}
					{
						loaded ?
							<Command.Group heading="Commands">
								{ActionMeta.map(({ value, keywords, icon, name, refresh, handle }) => {
									return (
										<Item
											key={value}
											isCommand
											value={value}
											keywords={keywords}
											commandHandle={async () => {
												await handle({ extDatas: extDatas, snapType: selectSnapId });
												refresh && getExtensionDatas();
											}}>
											<Logo>{icon}</Logo>
											{name}
										</Item>
									)
								})}
							</Command.Group>
							: null
					}
				</Command.List>

				<div cmdk-raycast-footer="">
					<ShootIcon />

					<button cmdk-raycast-subcommand-trigger="" onClick={onHandleUpdate}>
						{updateStatus === 1 ? <UpdateInfoIcon></UpdateInfoIcon> : (
							updateStatus === 2 ? <LineSpinnerIcon></LineSpinnerIcon> : null
						)}
						Update
						<kbd>⌘</kbd>
						<kbd>U</kbd>
					</button>
					<hr />

					<button cmdk-raycast-open-trigger="" onClick={onHandleOpenExt}>
						Open Extension Page
						<kbd>↵</kbd>
					</button>

					<hr />

					<SubCommand
						listRef={listRef}
						selectName={getExtensionDeatilById(value)?.name}
						inputRef={inputRef}
						onClickItem={onClickSubItem}
					/>
				</div>
			</Command>
			<SnapshotDialog snapOpen={snapshotOpen} snapshots={snapshots} onSnapChange={setSnapshotOpen} container={container} onSvaeSnap={onSvaeSnap}></SnapshotDialog>
			<div className="container-root" ref={setContainer}></div>
		</div>
	)
}

function Item({
	children,
	value,
	keywords,
	id,
	commandHandle,
	isCommand = false,
	extinfo = {},
	cls = '',
}: {
	children: React.ReactNode
	value: string
	keywords?: string[]
	isCommand?: boolean
	commandHandle?: any
	id?: string
	extinfo?: any
	cls?: string
}) {
	return (
		<Command.Item
			className={cls}
			value={value}
			keywords={keywords}
			onSelect={() => {
				isCommand ? commandHandle?.() : handleDoExt(extinfo)
			}}>
			{children}
			<span cmdk-raycast-meta="">{isCommand ? "Command" : "Extension"}</span>
		</Command.Item>
	)
}

function SubCommand({
	inputRef,
	listRef,
	selectName,
	onClickItem,
}: {
	inputRef: React.RefObject<HTMLInputElement>
	listRef: React.RefObject<HTMLElement>
	selectName?: string
	onClickItem?: any
}) {
	const [open, setOpen] = React.useState(false)
	const subCommandInputRef = React.useRef<HTMLInputElement>(null)

	React.useEffect(() => {
		function listener(e: KeyboardEvent) {
			if (e.key.toLocaleUpperCase() === "K" && e.metaKey) {
				e.preventDefault()
				setOpen((o) => !o)
				toast("Open SubCommand")
			}
			if (subCommandInputRef.current) {
				subCommandInputRef.current.focus()
			}
		}
		document.addEventListener("keydown", listener)
		return () => {
			document.removeEventListener("keydown", listener)
		}
	}, [])

	React.useEffect(() => {
		const el = listRef.current

		if (!el) return

		if (open) {
			el.style.overflow = "hidden"
		} else {
			el.style.overflow = ""
		}
	}, [open, listRef])

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
					e.preventDefault()
					inputRef?.current?.focus()
				}}>
				<Command>
					<Command.List>
						<Command.Empty>No Actions found.</Command.Empty>
						<Command.Group heading={selectName}>
							{
								SUB_ITME_ACTIONS.map((item) => <SubItem value={item.value} keywords={item.keywords} shortcut={item.shortcut} commandHandle={(value) => typeof onClickItem === 'function' && onClickItem(value)}  >
									{item.icon}
									{item.name}
								</SubItem>)
							}
							{/* <SubItem shortcut="⇧ F">
								<StarIcon />
								Open Snapshot Dialog
							</SubItem>
							<SubItem shortcut="↵">
								<WindowIcon />
								Open Application
							</SubItem>
							<SubItem shortcut="⌘ ↵">
								<FinderIcon />
								Show in Finder
							</SubItem>
							<SubItem shortcut="⌘ I">
								<FinderIcon />
								Show Info in Finder
							</SubItem>
							<SubItem shortcut="⌘ ⇧ F">
								<StarIcon />
								Add to Favorites
							</SubItem> */}
						</Command.Group>
					</Command.List>
					<Command.Input
						autoFocus
						ref={subCommandInputRef}
						placeholder="Search for actions..."
					/>
				</Command>
			</Popover.Content>
		</Popover.Root>
	)
}

function SubItem({
	value,
	keywords,
	children,
	shortcut,
	commandHandle,
}: {
	value: string
	keywords: string[]
	children: React.ReactNode
	shortcut: string,
	commandHandle?: any
}) {
	return (
		<Command.Item value={value} keywords={keywords} onSelect={() => { typeof commandHandle === 'function' && commandHandle(value) }}>
			{children}
			<div cmdk-raycast-submenu-shortcuts="">
				{shortcut.split(" ").map((key) => {
					return <kbd key={key}>{key}</kbd>
				})}
			</div>
		</Command.Item>
	)
}



function SnapshotDialog({ snapOpen, container, onSnapChange, snapshots = [], onSvaeSnap = null }) {
	const [open, setOpen] = React.useState(false)
	const [selectContainer, setSelectContainer] = React.useState(null)
	const [snapName, setSnapName] = React.useState('Snapshot 1')
	const [tabValue, setTabValue] = React.useState('add')
	const [snapId, setSnapId] = React.useState('')
	React.useEffect(() => {
		setOpen(snapOpen)
	}, [snapOpen])
	const onOpenChange = (v) => {
		setOpen(v)
		typeof onSnapChange === 'function' && onSnapChange(v);
	}
	const onInput = (e) => {
		setSnapName(e.target.value)
	}
	const onSave = () => {
		if (snapName.trim().length < 2) return
		setOpen(false)
		typeof onSvaeSnap === 'function' && onSvaeSnap(tabValue, snapId, snapName.trim());
	}
	return <Dialog.Root open={open} onOpenChange={onOpenChange}>
		<Dialog.Portal container={container}>
			<Dialog.Overlay className="DialogOverlay" />
			<Dialog.Content className="DialogContent">
				<Tabs.Root className="TabsRoot" defaultValue={tabValue} value={tabValue} onValueChange={setTabValue}>
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
							<input placeholder="snapshot name (min len 2)" minLength={2} maxLength={12} className="Input" value={snapName} onInput={onInput} />
						</fieldset>
					</Tabs.Content>
					<Tabs.Content className="TabsContent" value="replace">
						<p className="Text">Replace a snapshot</p>
						<Select.Root value={snapId} onValueChange={setSnapId}>
							<Select.Trigger className="SelectTrigger" aria-label="Food">
								<Select.Value placeholder={snapshots.length > 0 ? 'Select a Snapshot' : 'Snapshot Empty'} />
								<Select.Icon className="SelectIcon">
									<ChevronDownIcon />
								</Select.Icon>
							</Select.Trigger>
							<Select.Portal container={selectContainer}>
								<Select.Content className="SelectContent">
									{
										snapshots.length > 0 ? snapshots.map(({ id, name }) => <SelectItem value={id || getId()}>{name}</SelectItem>) : null
									}
								</Select.Content>
							</Select.Portal>
						</Select.Root>
						<div className="container-root" style={{ width: '100%', boxSizing: 'border-box', position: 'relative' }} ref={setSelectContainer}></div>
					</Tabs.Content>
				</Tabs.Root>
				<div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
					<button className="Button green" onClick={onSave}>Save</button>
				</div>
				<Dialog.Close asChild>
					<button className="IconButton" aria-label="Close"><Cross2Icon></Cross2Icon></button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

}


const SelectItem: any = React.forwardRef(({ children, className, ...props }: any, forwardedRef) => {
	return (
		<Select.Item className={classnames('SelectItem', className)} {...props} ref={forwardedRef}>
			<Select.ItemText>{children}</Select.ItemText>
			<Select.ItemIndicator className="SelectItemIndicator">
				<CheckIcon />
			</Select.ItemIndicator>
		</Select.Item>
	);
});