import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command } from '~component/cmdk/extension/command';
import { CommandPanel } from '~component/cmdk/extension/command-panel';

import { executeClipboardScript, safeInjectJQuery, toggleEyeComfortMode } from './handle';

const TabManagerComand = () => {
  return (
    <CommandPanel title="DevTools" icon={ExtensionLogo}>
      <Command.SimpleCommand
        name="inject-jquery"
        title="Inject JQuery Into Page"
        keywords={['inject', 'jquery']}
        description="Inject JQuery"
        endAfterRun
        handle={async () => {
          await safeInjectJQuery();
        }}
      />
      <Command.SimpleCommand
        name="execute-clipboard-script"
        title="立刻执行剪贴板中脚本"
        keywords={['exec', 'clipboard', 'script']}
        description="立刻执行剪贴板中脚本"
        endAfterRun
        handle={async () => {
          await executeClipboardScript();
        }}
      />

      <Command.SimpleCommand
        name="setDarkMode"
        title="护眼模式"
        keywords={['暗黑', '护眼', '保护眼睛', 'Dark']}
        description="切换护眼模式"
        endAfterRun
        handle={async () => {
          await toggleEyeComfortMode();
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
