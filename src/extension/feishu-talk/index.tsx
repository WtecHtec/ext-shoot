import ExtensionLogo from 'data-base64:./icon.png';
import React, { useEffect } from 'react';

import { Command } from '~component/cmdk/extension/command';
import { CommandPanel } from '~component/cmdk/extension/command-panel';

import { initMessageProcessor } from './handle';

// export const loadFlomoAction = () => {

//   window.saveClipboardToFlomo = saveClipboardToFlomo;
//   window.testIt = testIt;
//   console.log("flomor loaded");
//   console.log("window.saveClipboardToFlomo", window.saveClipboardToFlomo);
// };

const TabManagerComand = () => {
  useEffect(() => {
    // loadFlomoAction();
  }, []);
  return (
    <CommandPanel title="feishu talker" icon={ExtensionLogo}>
      {/* /监听消息 */}
      <Command.SimpleCommand
        name="listenMsgFromFeishu"
        title="监听群聊消息"
        keywords={['listen', 'msg', 'feishu']}
        description="监听群聊消息"
        endAfterRun
        handle={async () => {
          await initMessageProcessor();
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
