
import { createModuleProxy } from "~lib/atom";
import { methods } from "./common";

// refer
// https://developer.chrome.com/docs/extensions/reference/api/tabs?hl=zh-cn

// need windows permission in  manifest.json
const moduleName = 'window-manage';


export default {
    name: moduleName,
    methods,
    action: createModuleProxy(moduleName, {
        ...methods,
    }),
};