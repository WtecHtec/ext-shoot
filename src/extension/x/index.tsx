import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';

import { repostToJike } from './handle';

const TabManagerComand = () => {
  return (
    <MotionPack title="X" icon={ExtensionLogo}>
      {/* <Command.Simple
        name="test"
        title="test"
        keywords={["test"]}
        description="test"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      /> */}
      {/* repostToJike */}
      <Motion.Simple
        name="repostToJike"
        title="把这篇帖子转发到即刻"
        keywords={['repost', 'jike']}
        description="转发到即刻"
        endAfterRun
        handle={async () => {
          await repostToJike();
        }}
      />

      {/* <Command.Simple
        name="saveClipboardToFlomo"
        title="把剪贴板的内容保存为Memo"
        keywords={["save", "clipboard", "flomo"]}
        description="将剪贴板的内容保存到Flomo"
        endAfterRun
        handle={async () => {
          await saveClipboardToFlomo();
        }}
      /> */}
    </MotionPack>
  );
};

export default TabManagerComand;
