import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';

import { translateInputWords } from './handle';

const superInput = () => {
  return (
    <MotionPack title="SuperInput" icon={ExtensionLogo}>
      <Motion.Simple
        name="inputTranslate"
        title="将当前输入内容翻译成英文"
        keywords={['翻译', 'translate', 'search', 'input', 'keywords']}
        description="将当前内容翻译成英文"
        endAfterRun
        handle={async () => {
          await translateInputWords();
        }}
      />
    </MotionPack>
  );
};

export default superInput;
