import ExtensionLogo from 'data-base64:./icon.png';
import MiTaSoLogo from 'data-base64:./icons/mitaso.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';
import { GoogleSearchTopic } from '~topics';

import { testIt } from './handle';

const superGoogle = () => {
  return (
    <MotionPack title="SuperGoogle" icon={ExtensionLogo} keywords={['dev']} topics={[GoogleSearchTopic]}>
      <Motion.Simple
        name="test"
        title="test Title"
        keywords={['test']}
        description="test Description"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      />
      <Motion.Simple
        icon={MiTaSoLogo}
        name="mitaso"
        title="在秘塔AI中搜索"
        keywords={['mitaso', 'search']}
        description="在秘塔AI中搜索"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      />
    </MotionPack>
  );
};

export default superGoogle;
