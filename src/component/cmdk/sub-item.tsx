/* eslint-disable react/no-unknown-property */
import { Command } from "cmdk";

import React from 'react';

export default function SubItem({
	value,
	keywords,
	children,
	shortcut,
	commandHandle,
	style,
}: {
	value: string
	keywords: string[]
	children: React.ReactNode
	shortcut: string
	commandHandle?: any
	style?: any
}) {
	// console.log(shortcut);
	return (
		<Command.Item
			style={style}
			value={value}
			keywords={keywords}
			onSelect={() => {
				typeof commandHandle === 'function' && commandHandle(value);
			}}>
			{children}
			<div  cmdk-raycast-submenu-shortcuts="">
				{shortcut
					? shortcut.split('').map((key) => {
						return <kbd key={key}>{key}</kbd>;
					})
					: null}
			</div>
		</Command.Item>
	);
}
