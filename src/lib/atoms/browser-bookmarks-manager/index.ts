import { createModuleProxy } from "~lib/atom";
import { methods } from "./common";

// refer
// https://developer.chrome.com/docs/extensions/reference/api/tabs?hl=zh-cn
// need bookmarks permission in  manifest.json
export default {
    name: 'bookmarks-manage',
    methods,
    action: createModuleProxy('bookmarks-manage', {
        ...methods,
    }),
};