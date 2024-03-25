/* eslint-disable react/display-name */

import React from 'react';
import { MagnifyingGlassIcon} from '@radix-ui/react-icons';
import {Command} from 'cmdk';
import { getBrowser } from '~utils/util';
import { handleAddRecently } from '~utils/management';
import { SearchFix } from '~config/config';
const Search = React.forwardRef(({ search }: { search: string}, ref) => {
	const [storeInfo, setStoreInfo] = React.useState({
		lable: 'chromewebstore.google.com',
		url: 'https://chromewebstore.google.com/search/',
	});
	React.useImperativeHandle(ref, () => ({
		onSearch,
	}));
	React.useEffect(() => {
		const STORE_MAP = {
			chrome: {
				lable: 'chromewebstore.google.com',
				url: 'https://chromewebstore.google.com/search/'
			},
			arc: {
				lable: 'chromewebstore.google.com',
				url: 'https://chromewebstore.google.com/search/'
			},
			edge: {
				lable: 'microsoftedge.microsoft.com',
				url: 'https://microsoftedge.microsoft.com/addons/search/'
			}
		};
		const browser = getBrowser();
		setStoreInfo(STORE_MAP[browser] || storeInfo);
	}, []);
	const onSearch = () => {
		window.open(`${storeInfo.url}${search}`);
		handleAddRecently({
			value: `${SearchFix}${search}`,
			extIds: [`${storeInfo.url}${search}`],
			isCommand: true,
			name: `Views search results for "${search}" on ${storeInfo.lable}`,
		});
	};
	return <Command.Group heading="Web Store">
			<Command.Item
			value={ `${SearchFix}${search}` }
			keywords={[SearchFix, search]}
			onSelect={ () => {
				onSearch();
			} }>
				<MagnifyingGlassIcon></MagnifyingGlassIcon>
				{ `Views search results for "${search}" on ${storeInfo.lable}` }
		</Command.Item> 
	</Command.Group>;
});
export default Search;