import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';
import { V2exTopic } from '~topics';

import { handleVexSign } from './handle';

const TabManagerComand = () => {
  return (
    <MotionPack title="V2ex" icon={ExtensionLogo} topics={[V2exTopic]}>
      <Motion.Simple
        name="v2ex-sign"
        title="帮我去签到"
        keywords={['sign', '签到', 'v2ex签到']}
        description="v2ex签到"
        endAfterRun
        handle={async () => {
          await handleVexSign();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
