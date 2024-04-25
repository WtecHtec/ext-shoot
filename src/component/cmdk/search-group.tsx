/* eslint-disable react/display-name */

import React from 'react';
import { Command } from 'cmdk';
import ChromeStoreWebSearch from '~component/extension/chrome-store-web-search';
import InstantOpen from '~component/extension/instant-open';
import ChromeStoreSearch from '~component/extension/chrome-store-search';
const Search = React.forwardRef(({ search }: { search: string}) => {
	
	return <Command.Group heading={`Use "${search}" with ... `}>
		<ChromeStoreSearch search={search} ></ChromeStoreSearch>
		<ChromeStoreWebSearch search={search} ></ChromeStoreWebSearch>
		<InstantOpen search={search} ></InstantOpen>
	</Command.Group>;
});
export default Search;