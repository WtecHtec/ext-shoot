
import { createModuleProxy } from "~lib/atom";
import { methods } from "./common";

// refer
// https://developer.chrome.com/docs/extensions/reference/api/browsingData#description
// need browsingData permission in  manifest.json
const moduleName = 'browsing-data-manage';


export default {
    name: moduleName,
    methods,
    action: createModuleProxy(moduleName, {
        ...methods,
    }),
};


