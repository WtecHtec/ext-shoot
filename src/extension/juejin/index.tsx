import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';
import { juejinTopic } from '~topics';

import { handleJuejinSign, switchThemeByJuejin } from './handle';

const TabManagerComand = () => {
  return (
    <MotionPack title="JueJin" icon={ExtensionLogo} topics={[juejinTopic]}>
      <Motion.Simple
        name="juejinsign"
        title="帮我去签到"
        keywords={['签到', '掘金签到']}
        description="掘金签到"
        endAfterRun
        handle={async () => {
          await handleJuejinSign();
        }}
      />
      <Motion.Simple
        name="switch-juejin-theme"
        title="换一个主题"
        keywords={['switch theme', '切换主题']}
        description="切换到另一个主题"
        endAfterRun
        handle={async () => {
          await switchThemeByJuejin();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
