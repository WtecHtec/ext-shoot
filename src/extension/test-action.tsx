/* eslint-disable react/display-name */

import React, { SVGProps } from 'react';
import { Command } from 'cmdk';
import tabManage from '~lib/atoms/browser-tab-manager';

const PREFIX = 'test-action';
function LinkIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width={512}
			height={512}
			viewBox="0 0 512 512"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			className=""
			{...props}
		>
			<rect
				id="r4"
				width={512}
				height={512}
				x={0}
				y={0}
				rx={128}
				fill="url(#r5)"
				stroke="#FFFFFF"
				strokeWidth={0}
				strokeOpacity="100%"
				paintOrder="stroke"
			/>
			<clipPath id="clip">
				<use xlinkHref="#r4" />
			</clipPath>
			<defs>
				<linearGradient
					id="r5"
					gradientUnits="userSpaceOnUse"
					gradientTransform="rotate(180)"
					style={{ transformOrigin: "center center" }}
				>
					<stop stopColor="#5C5C5C" />
					<stop offset={1} stopColor="#0F1015" />
				</linearGradient>
				<radialGradient
					id="r6"
					cx={0}
					cy={0}
					r={1}
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(256) rotate(90) scale(512)"
				>
					<stop stopColor="white" />
					<stop offset={1} stopColor="white" stopOpacity={0} />
				</radialGradient>
			</defs>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 16 16"
				width={352}
				height={352}
				x={80}
				y={80}
				alignmentBaseline="middle"
				style={{ color: "rgb(255, 255, 255)" }}
			>
				<path
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					d="M1.75 10.25v-.672a2 2 0 0 1 .586-1.414l5.828-5.828a2 2 0 0 1 1.414-.586h.672a4 4 0 0 1 4 4v.672a2 2 0 0 1-.586 1.414l-5.828 5.828a2 2 0 0 1-1.414.586H5.75a4 4 0 0 1-4-4Z"
				/>
				<path
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9.5 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.5 9a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
				/>
			</svg>
		</svg>

	);
}

const Search = React.forwardRef(({ search }: { search: string }, ref) => {

	React.useImperativeHandle(ref, () => ({
		onSearch,
	}));

	const onSearch = () => {
		const tabAction = tabManage.action;
		tabAction.duplicateTab();
	};

	return <Command.Item
		key={`${PREFIX}${search}`}
		value={`${PREFIX}${search}`}
		keywords={['open', search]}
		onSelect={() => {
			onSearch();
		}}>
		<LinkIcon></LinkIcon>
		{`Test Action`}
		<span cmdk-motionshot-sub="" style={{ flexShrink: 0 }}> GPTsMotion</span>
		<span cmdk-motionshot-meta="" style={{ flexShrink: 0 }}> Command</span>

	</Command.Item>;
});
export default Search;
