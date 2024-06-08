import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';

import { checkTraffic } from './handle';

const TabManagerComand = () => {
  return (
    <MotionPack title="Web Traffic" icon={ExtensionLogo}>
      <Motion.Simple
        name="web-traffic"
        title="Go Similarweb"
        keywords={['web traffic', 'web']}
        description="Open the browser's web traffic page"
        endAfterRun
        handle={async () => {
          await checkTraffic();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
