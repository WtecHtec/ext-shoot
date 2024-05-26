/* eslint-disable react/no-unknown-property */
import { Command } from "motion-cmdk";

import React from 'react';
import { getPlatform } from "~utils/util";

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
			<div cmdk-motionshot-submenu-shortcuts="">
				{shortcut
					? shortcut.split(getPlatform() === 'mac' ? '' : ' ').map((key) => {
						return <kbd key={key}>{key}</kbd>;
					})
					: null}
			</div>
		</Command.Item>
	);
}

