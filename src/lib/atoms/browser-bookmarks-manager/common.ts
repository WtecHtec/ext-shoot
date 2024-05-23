import { getWebPageStatus } from "~lib/util";

const trashFolder = {
  parentId: "1",
  title: "Trash",
};

const moveToTrash = (bookmarkId: string, trashId: string) => {
  chrome.bookmarks.move(bookmarkId, { parentId: trashId });
};
/**
 * Clean the bookmarks
 */
const handleCleanBookmarks = async () => {
	chrome.bookmarks.search({ title: trashFolder.title }, (trashFolders) => {
    const trashFolderExists = trashFolders.length > 0;
    if (trashFolderExists) {
      const trash = trashFolders[0];
      checkBookmarkStatus(trash);
    } else {
      chrome.bookmarks.create(
        trashFolder,
        checkBookmarkStatus,
      );
    }
  });
};

/**
 * Move 404 to the Trash folder
 * @param trash 
 */
const checkBookmarkStatus = async (trash: chrome.bookmarks.BookmarkTreeNode) => {
	const bookMarks = await chrome.bookmarks.getTree();
	if (Array.isArray(bookMarks)) {
		let queues = [...bookMarks];
			while(queues.length > 0) {
				const item = queues.shift();
				if (item.title === 'Trash') continue;
				if (item.children) {
					queues = [...item.children, ...queues];
				}
				if (item.id && item.url) {
					const [err, res ] =	await getWebPageStatus(item.id, item.url);
					if (!err && res && res.isDeadBookmark) {
						moveToTrash(item.id, trash.id);
				}
			}
		}
	}
};
export  const methods = {
	handleCleanBookmarks,
};
