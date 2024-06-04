import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';

import { toggleEyeComfortMode } from './handle';

const themeLover = () => {
  return (
    <MotionPack title="themeLover" icon={ExtensionLogo}>
      <Motion.Simple
        name="setGrayMode"
        title="切换护眼模式"
        keywords={['暗黑', '护眼', '保护眼睛', 'Dark']}
        description="切换护眼模式"
        endAfterRun
        handle={async () => {
          await toggleEyeComfortMode();
        }}
      />
    </MotionPack>
  );
};

export default themeLover;
