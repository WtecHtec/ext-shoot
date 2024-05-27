import { createModuleProxy } from '~lib/atom';

import { methods } from './common';

// refer
// https://developer.chrome.com/docs/extensions/reference/api/tabs?hl=zh-cn
// need management permission in  manifest.json
// only support chrome browser not support firefox

export default {
  name: 'extension-manage',
  methods,
  action: createModuleProxy('extension-manage', {
    ...methods
  })
};
