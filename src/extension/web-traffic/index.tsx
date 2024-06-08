import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';

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
