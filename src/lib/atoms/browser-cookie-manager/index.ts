
import { createModuleProxy } from "~lib/atom";
import { methods } from "./common";

// refer
// https://developer.chrome.com/docs/extensions/reference/api/cookies
// need cookies permission in  manifest.json
const moduleName = 'browsing-cookies-manage';


export default {
    name: moduleName,
    methods,
    action: createModuleProxy(moduleName, {
        ...methods,
    }),
};


