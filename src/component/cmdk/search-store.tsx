/* eslint-disable react/display-name */

import React from 'react';
import {Command} from 'cmdk';
import { getBrowser } from '~utils/util';
import { handleAddRecently } from '~utils/management';
import { SearchFix } from '~config/config';
import { GoogleStoreIcon } from '~component/icons';
const Search = React.forwardRef(({ search }: { search: string}, ref) => {
	const [storeInfo, setStoreInfo] = React.useState({
		lable: 'chrome store',
		url: 'https://chromewebstore.google.com/search/',
	});
	React.useImperativeHandle(ref, () => ({
		onSearch,
	}));
	React.useEffect(() => {
		const STORE_MAP = {
			chrome: {
				lable: 'chrome store',
				url: 'https://chromewebstore.google.com/search/'
			},
			arc: {
				lable: 'chrome store',
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
		console.log('onSearch');
		window.open(`${storeInfo.url}${search}`);
		handleAddRecently({
			value: `${SearchFix}${search}`,
			extIds: [`${storeInfo.url}${search}`],
			isCommand: true,
			name: `Search Extensions for "${search}" on ${storeInfo.lable}`,
		});
	};
	return <Command.Group heading={`Use "${search}" with ... `}>
			<Command.Item
			value={ `${SearchFix}${search}` }
			keywords={[SearchFix, search]}
			onSelect={ () => {
				onSearch();
			} }>
				<GoogleStoreIcon></GoogleStoreIcon>
				{ `Search Chrome Store` }
				<span cmdk-raycast-meta="" style={{ flexShrink: 0}}> Command</span>
		</Command.Item> 
	</Command.Group>;
});
export default Search;