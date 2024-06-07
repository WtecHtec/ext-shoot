import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';

import { searchClipboardText } from './handle';

const metasoQuick = () => {
  return (
    <MotionPack title="metaso-quick" icon={ExtensionLogo}>
      <Motion.Simple
        name="search-clipboard-text"
        title="搜索剪贴板内容"
        keywords={['search', 'clipboard']}
        description="搜索剪贴板内容"
        endAfterRun
        handle={async () => {
          await searchClipboardText();
        }}
      />
    </MotionPack>
  );
};

export default metasoQuick;
