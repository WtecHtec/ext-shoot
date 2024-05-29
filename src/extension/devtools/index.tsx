import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command, CommandPanel } from '~component/cmdk/common/Command';

import { safeInjectJQuery, setDarkMode } from './handle';

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
      {/* <Command.SimpleCommand
        name="saveClipboardToFlomo"
        title="把剪贴板的内容保存为Memo"
        keywords={["save", "clipboard", "flomo"]}
        description="将剪贴板的内容保存到Flomo"
        endAfterRun
        handle={async () => {
          await saveClipboardToFlomo();
        }}
      /> */}

		<Command.SimpleCommand
        name="setDarkMode"
        title="护眼模式"
        keywords={["暗黑", "护眼", "保护眼睛", 'Dark']}
        description="将剪贴板的内容保存到Flomo"
        endAfterRun
        handle={async () => {
          await setDarkMode();
        }}
      /> 
    </CommandPanel>
  );
};

export default TabManagerComand;
