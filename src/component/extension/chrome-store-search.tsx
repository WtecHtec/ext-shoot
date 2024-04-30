/* eslint-disable react/display-name */

import React, { SVGProps } from "react";

import { appManager } from "~component/cmdk/app/app-manager";
import { Action } from "~component/cmdk/common/Action";
import { ActionPanel } from "~component/cmdk/common/ActionPanel";
import List from "~component/cmdk/common/List";
import { searchManager } from "~component/cmdk/search/search-manager";

const PREFIX = "ChromeStoreSearch2222";

function AppIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width={512}
			height={512}
			viewBox="0 0 512 512"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			className=""
			{...props}>
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
					style={{ transformOrigin: "center center" }}>
					<stop stopColor="#5C5C5C" />
					<stop offset={1} stopColor="#0F1015" />
				</linearGradient>
				<radialGradient
					id="r6"
					cx={0}
					cy={0}
					r={1}
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(256) rotate(90) scale(512)">
					<stop stopColor="white" />
					<stop offset={1} stopColor="white" stopOpacity={0} />
				</radialGradient>
			</defs>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={389}
				height={389}
				viewBox="0 0 24 24"
				x="61.5"
				y="61.5"
				alignmentBaseline="middle"
				style={{ color: "rgb(255, 255, 255)" }}>
				<path
					fill="currentColor"
					d="M9.827 21.763C5.35 20.771 2 16.777 2 12c0-1.822.487-3.53 1.339-5.002l4.283 7.419a4.999 4.999 0 0 0 4.976 2.548zM12 22l4.287-7.425A4.977 4.977 0 0 0 17 12a4.978 4.978 0 0 0-1-3h5.542A9.98 9.98 0 0 1 22 12c0 5.523-4.477 10-10 10m2.572-8.455a2.999 2.999 0 0 1-5.17-.045l-.029-.05a3 3 0 1 1 5.225.05zm-9.94-8.306A9.974 9.974 0 0 1 12 2a9.996 9.996 0 0 1 8.662 5H12a5.001 5.001 0 0 0-4.599 3.034z"
				/>
			</svg>
		</svg>
	);
}

const Search = ({ search }: { search: string }) => {
	const onSearch = () => {
		appManager.startApp("Store Search");
		// 如果是 use 。。。 with 的话，这里可以传入第二个参数，不用清除
		searchManager.clearSearch();
	};

	return (
		<List.Item
			key={`${PREFIX}${search}`}
			id={`${PREFIX}${search}`}
			keywords={["open", "chrome", "store", search]}
			title="Chrome Store"
			icon={<AppIcon></AppIcon>}
			onSelect={onSearch}
			actions={
				<ActionPanel>
					<ActionPanel.Section title="Actions">
						<Action.OpenInBrowser
							url={`https://chrome.google.com/webstore/search/${search}`}
						/>
						<Action.CopyToClipboard
							content={`https://chrome.google.com/webstore/search/${search}`}
							shortcut={{ modifiers: ["cmd"], key: "c" }}
						/>
					</ActionPanel.Section>
				</ActionPanel>
			}
		/>
	);
};
export default Search;
