import ExtensionLogo from 'data-base64:./icon.png';
import React, { useEffect } from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';
import { flomoTopic } from '~topics';

import { saveClipboardToFlomo, testIt } from './handle';

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
    <MotionPack title="flomor" icon={ExtensionLogo} topics={[flomoTopic]}>
      <Motion.Simple
        name="test"
        title="test"
        keywords={['test']}
        description="test"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      />
      <Motion.Simple
        name="saveClipboardToFlomo"
        title="把剪贴板的内容保存为Memo"
        keywords={['save', 'clipboard', 'flomo']}
        description="将剪贴板的内容保存到Flomo"
        endAfterRun
        handle={async () => {
          await saveClipboardToFlomo();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
