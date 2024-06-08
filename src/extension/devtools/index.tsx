import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';

import { executeClipboardFunc, executeClipboardScript, safeInjectJQuery } from './handle';

const TabManagerComand = () => {
  return (
    <MotionPack title="DevTools" icon={ExtensionLogo}>
      <Motion.Simple
        name="inject-jquery"
        title="Inject JQuery Into Page"
        keywords={['inject', 'jquery']}
        description="Inject JQuery"
        endAfterRun
        handle={async () => {
          await safeInjectJQuery();
        }}
      />
      <Motion.Simple
        name="execute-clipboard-func"
        title="立刻执行剪贴板中函数"
        keywords={['exec', 'clipboard', 'func']}
        description="立刻执行剪贴板中函数"
        endAfterRun
        handle={async () => {
          await executeClipboardFunc();
        }}
      />
      <Motion.Simple
        name="execute-clipboard-script"
        title="立刻执行剪贴板中脚本"
        keywords={['exec', 'clipboard', 'script']}
        description="立刻执行剪贴板中脚本"
        endAfterRun
        handle={async () => {
          await executeClipboardScript();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
