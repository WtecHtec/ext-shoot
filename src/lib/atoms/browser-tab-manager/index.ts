import { createModuleProxy } from "~lib/atom";
import { methods } from "./common";

// refer
// https://developer.chrome.com/docs/extensions/reference/api/tabs?hl=zh-cn
// need tabs permission in  manifest.json
export default {
    name: 'tab-manage',
    methods,
    action: createModuleProxy('tab-manage', {
        ...methods,
    }),
};
// crosstabExec(id).init().get().then((res) => {})