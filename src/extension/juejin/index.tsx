import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command, CommandPanel } from '~component/cmdk/common/Command';

import { handleJuejinSign,  } from './handle';
import { juejinTopic } from '~topics';

const TabManagerComand = () => {
  return (
    <CommandPanel title="JueJin" icon={ExtensionLogo} topics={[juejinTopic]}>
      <Command.SimpleCommand
        name="juejinsign"
        title="帮我去签到"
        keywords={['签到', '掘金签到']}
        description="掘金签到"
        endAfterRun
        handle={async () => {
          await handleJuejinSign();
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
    </CommandPanel>
  );
};

export default TabManagerComand;
