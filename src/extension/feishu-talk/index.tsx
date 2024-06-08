import ExtensionLogo from 'data-base64:./icon.png';
import React, { useEffect } from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';

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
    <MotionPack title="feishu talker" icon={ExtensionLogo}>
      {/* /监听消息 */}
      <Motion.Simple
        name="listenMsgFromFeishu"
        title="监听群聊消息"
        keywords={['listen', 'msg', 'feishu']}
        description="监听群聊消息"
        endAfterRun
        handle={async () => {
          await initMessageProcessor();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
