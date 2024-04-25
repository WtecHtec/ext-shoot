/* eslint-disable react/display-name */

import React from 'react';
import { Command } from 'cmdk';
import ChromeStoreWebSearch from '~component/extension/chrome-store-web-search';
import InstantOpen from '~component/extension/instant-open';
const Search = React.forwardRef(({ search }: { search: string}, ref) => {
	
	return <Command.Group heading={`Use "${search}" with ... `}>
			
		<ChromeStoreWebSearch search={search} ref={ref}></ChromeStoreWebSearch>
		<InstantOpen search={search} ref={ref}></InstantOpen>
	</Command.Group>;
});
export default Search;