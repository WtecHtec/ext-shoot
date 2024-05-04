/* eslint-disable react/display-name */

import React from 'react';
import { Command } from 'cmdk';
import ChromeStoreWebSearch from '~extension/chrome-store-web-search';
import InstantOpen from '~extension/instant-open';
import ChromeStoreSearch from '~extension/chrome-store-search';
function ExtensionWithSearch({ search }: { search: string; }) {

	return (
		<Command.Group heading={`Use "${search}" with ... `}>
			<ChromeStoreSearch search={search}></ChromeStoreSearch>
			<ChromeStoreWebSearch search={search}></ChromeStoreWebSearch>
			<InstantOpen search={search}></InstantOpen>
		</Command.Group>
	);
}
export default ExtensionWithSearch;
