import { getWebPageStatus } from "~lib/util";

/**
 * Clean the bookmarks
 */
const handleCleanBookmarks = async () => {
	const bookMarks = await chrome.bookmarks.getTree();
	if (Array.isArray(bookMarks)) {
		let queues = [...bookMarks];
			while(queues.length > 0) {
				const item = queues.shift();
				if (item.children) {
					queues = [...item.children, ...queues];
				}
				if (item.id && item.url) {
					const [err, res ] =	await getWebPageStatus(item.id, item.url);
					if (!err && res && res.isDeadBookmark) {
						await chrome.bookmarks.removeTree(item.id);
				}
			}
		}
	}
};
export  const methods = {
	handleCleanBookmarks,
};
