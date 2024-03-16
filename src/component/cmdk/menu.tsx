import * as Popover from "@radix-ui/react-popover"
import { Command } from "cmdk"
import { set } from "lodash"
import React, { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { EXT_UPDATE } from "~config/actions"
import { HAS_CRX_UPDATE } from "~config/cache.config"
import { ActionMeta } from "~utils/actions"
import { getExtensionAll, handleExtFavoriteDone, handleOpenExtensionDetails } from "~utils/management"

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

const storage = new Storage({
	area: "local"
})

export function RaycastCMDK() {
	const [value, setValue] = React.useState("")
	const [extDatas, setExtDatas] = React.useState([])
	const [originDatas, setOriginDatas] = React.useState([])
	const [hasUpdate, setHasUpdate] = React.useState(false)
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const listRef = React.useRef(null)
	const [search, setSearch] = useState(null)

	// const inputRef = React.useRef<HTMLInputElement | null>(null)
	/**
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
		const [err, res] = await getExtensionAll()
		if (err || !Array.isArray(res)) {
			return
		}
		const groups = [
			{
				name: 'Favorite',
				key: 'favorite',
				children: [],
			},
			{
				name: 'Development',
				key: 'development',
				children: [],
			}, {
				name: 'Other',
				key: 'other',
				children: [],
			}]
		let lastInx = groups.length - 1
		setHasUpdate(checkUpdate(res));
		res.forEach(item => {
			const { installType, favorite } = item
			if (favorite) {
				groups[0].children.push(item)
			} else if (installType === 'development') {
				groups[1].children.push(item)
			} else {
				groups[lastInx].children.push(item)
			}
		})
		setOriginDatas(res)
		setExtDatas(groups)
	}

	/** icon 为空，则为有更新 */
	const checkUpdate = (exts) => {
		return !!exts.find(({ icon }) => !icon)
	}

	/** 触发按键 */
	React.useEffect(() => {
		async function listener(e: KeyboardEvent) {
			if (e.key === "F" && e.shiftKey && e.metaKey) {
				const extDeatil = getExtensionDeatilById(value)
				if (!extDeatil) return
				e.preventDefault()
				if (listRef.current) {
					listRef.current.scrollTop = 0 // 滚动到顶部
				}
				const favorite = extDeatil?.favorite
				await handleExtFavoriteDone(value, !favorite)
				await getExtensionDatas();
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
			if (request.action === EXT_UPDATE) {
				// 在这里处理接收到的消息
				setHasUpdate(true)
				// 发送响应
				sendResponse({ result: "Message processed in content.js" })
			}
		}
		chrome.runtime.onMessage.addListener(handelMsgBybg)
		return () => {
			chrome.runtime.onMessage.removeListener(handelMsgBybg)
		}
	}, [])


	// 当搜索内容变化时，滚动到列表顶部
	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = 0 // 滚动到顶部
		}
		console.log("listRef", listRef)
	}, [search]) // 依赖search，当search变化时，执行effect

	const getExtensionDeatilById = (id: string) => {
		return originDatas.find((ext) => ext.id === id)
	}

	return (
		<div className="ext-shoot">
			<Command value={value} onValueChange={(v) => setValue(v)}>
				<div cmdk-raycast-top-shine="" />
				<Command.Input
					value={search}
					onValueChange={setSearch}
					ref={inputRef}
					autoFocus
					placeholder="Search for extensions and commands..."
				/>
				<hr cmdk-raycast-loader="" />
				<Command.List ref={listRef}>
					<Command.Empty>No results found.</Command.Empty>
					{
						extDatas.length > 0 ? extDatas?.map(({ children, name }) => {
							return <>
								{
									children && children.length > 0 ? <>
										<Command.Group heading={name}>
											{children?.map(({ id, name, icon }) => {
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
					<Command.Group heading="Commands">
						{ActionMeta.map(({ value, keywords, icon, name, handle }) => {
							return (
								<Item
									key={value}
									isCommand
									value={value}
									keywords={keywords}
									commandHandle={handle}>
									<Logo>{icon}</Logo>
									{name}
								</Item>
							)
						})}
					</Command.Group>
				</Command.List>

				<div cmdk-raycast-footer="">
					<ShootIcon />

					<button cmdk-raycast-open-trigger="">
						{hasUpdate ? <UpdateInfoIcon></UpdateInfoIcon> : null}
						Update
						<kbd>U</kbd>
					</button>
					<hr />

					<button cmdk-raycast-open-trigger="">
						Open Extension Page
						<kbd>↵</kbd>
					</button>

					<hr />

					<SubCommand
						listRef={listRef}
						selectedValue={value}
						selectName={getExtensionDeatilById(value)?.name}
						inputRef={inputRef}
					/>
				</div>
			</Command>
		</div>
	)
}

function Item({
	children,
	value,
	keywords,
	id,
	commandHandle,
	isCommand = false
}: {
	children: React.ReactNode
	value: string
	keywords?: string[]
	isCommand?: boolean
	commandHandle?: any
	id?: string
}) {
	return (
		<Command.Item
			value={value}
			keywords={keywords}
			onSelect={() => {
				isCommand ? commandHandle?.() : handleOpenExtensionDetails(id)
			}}>
			{children}
			<span cmdk-raycast-meta="">{isCommand ? "Command" : "Extension"}</span>
		</Command.Item>
	)
}

function SubCommand({
	inputRef,
	listRef,
	selectedValue,
	selectName
}: {
	inputRef: React.RefObject<HTMLInputElement>
	listRef: React.RefObject<HTMLElement>
	selectedValue: string
	selectName?: string
}) {
	const [open, setOpen] = React.useState(false)
	const subCommandInputRef = React.useRef<HTMLInputElement>(null)

	React.useEffect(() => {
		function listener(e: KeyboardEvent) {
			if (e.key === "K" && e.metaKey) {
				e.preventDefault()
				setOpen((o) => !o)
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
							</SubItem>
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
	children,
	shortcut
}: {
	children: React.ReactNode
	shortcut: string
}) {
	return (
		<Command.Item>
			{children}
			<div cmdk-raycast-submenu-shortcuts="">
				{shortcut.split(" ").map((key) => {
					return <kbd key={key}>{key}</kbd>
				})}
			</div>
		</Command.Item>
	)
}
