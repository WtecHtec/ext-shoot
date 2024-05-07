
import React, { useEffect, useState } from 'react';
import { searchManager } from '~component/cmdk/search/search-manager';
import { GlobeIcon } from '~component/icons';
import useDebounce from '~hooks/useDebounce';

import { getSnapSeekData } from '~utils/management';

function HistorySearch() {

	const [sourceData, setSourceData] = useState({});
	const [displayData, setDisplayData] = useState({});
	const handleSearch = useDebounce(async (value) =>{
		console.log(`searching ${value}`);
		if (value.trim()) {
			const [, snapsData] = await getSnapSeekData();
			if (snapsData && Object.keys(snapsData).length) {
				const result = {};
				Object.keys(snapsData).map(key => {
				const datas  = snapsData[key].filter(item => {
						return item.title.includes(value) || item.text.includes(value) || item.url.includes(value);
					}).map((item) => {
						const diff = 5;
						let text = item.text;
						let fidx = text.indexOf(value);
						item.searchTags = [];
						while(fidx > -1) {
							item.searchTags.push([text.substring(fidx - diff, fidx), value, text.substring(fidx + value.length , fidx + diff)]);
							text = text.substring(fidx + value.length, text.length);
							fidx = text.indexOf(value);
						}
						return {
							...item,
						};
					});
					datas.length && (result[key] = datas);
				});
				setDisplayData(result);
			}
		} else {
			setDisplayData(sourceData);
		}
	}, 500);

	useEffect(() => {

		getSnapSeekData().then((data) => {
			const [, snapsData] = data;
			setDisplayData(snapsData);
			setSourceData(snapsData);
		});
		// 使用新的接口调用方式
		const unsubscribe = searchManager.subscribe(({ search }) => {
			handleSearch(search);
		});
		return unsubscribe; // Cleanup on unmount
	}, []);
    return (
			<div snap-seek-cmdk-list="">
			{
				Object.keys(displayData).length <= 0
					? <div cmdk-empty="">No results found.</div>
					: Object.keys(displayData).map(item =><>
						{
							displayData[item].length === 0 
								? null
								: <div snap-seek-cmdk-group="">
									<div snap-seek-cmdk-group-heading="">{item}</div> 
									{
										displayData[item].map(({ title, url,  icon, searchTags, text}) =>
											<div key={title} onClick={() => window.open(url, '_blank')} snap-seek-cmdk-item="">
													<div className="snap-seek-item"> 
													{
														icon 
															? <img className="snap-seek-item-img" src={icon.replace(/http[s]:/, '') }></img> 
															: 	<GlobeIcon className="snap-seek-item-img"></GlobeIcon>
													}
														<div className="snap-seek-item-title">{title}</div>	
														<a href={url} target="_blank" className="snap-seek-item-url" rel="noreferrer"> { url }</a> 
													</div>
													{
														searchTags  && searchTags.length
															? <div className="snap-seek-item-search">
																{searchTags.map((tag) => <div key={tag} className="tag" >{tag[0]} <span>{tag[1]}</span> {tag[2]}</div>) }
															</div>
															: <div className="snap-seek-text-content">{text}</div>
													}
												</div>
											)
										}
								</div>
							}
					</>)
			}
		</div>
    );
}


const meta = {
    name: 'History Search',
    App: HistorySearch,
};

export default meta;
