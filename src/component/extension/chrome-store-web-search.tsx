/* eslint-disable react/display-name */

import React from 'react';
import { Command } from 'cmdk';
import { GoogleStoreIcon } from '~component/icons';

const PREFIX = 'ChromeStoreWebSearch';

function chromeStoreLink(word: string): string {
		const link = `https://chromewebstore.google.com/search/${word}`;
		return link;
	}
	

const Search = React.forwardRef(({ search }: { search: string }, ref) => {
	React.useImperativeHandle(ref, () => ({
		onSearch,
	}));

	const onSearch = () => {
		const normalizedLink = chromeStoreLink(search);
		window.open(normalizedLink);
	};
	return <Command.Item
		key={`${PREFIX}${search}`}
		value={`${PREFIX}${search}`}
		keywords={['open','chrome','store', search]}
		onSelect={() => {
			onSearch();
		}}>
		<GoogleStoreIcon></GoogleStoreIcon>
		{`Chrome Store Search`}
		<span cmdk-raycast-sub="" style={{ flexShrink: 0}}> GPTsMotion</span>
		<span cmdk-raycast-meta="" style={{ flexShrink: 0 }}> Command</span>

	</Command.Item>;
});
export default Search;