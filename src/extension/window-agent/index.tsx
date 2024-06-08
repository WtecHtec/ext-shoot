import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';
import WindowManage from '~lib/atoms/browser-window-manager';

const windowAction = WindowManage.action;
const TabManagerComand = () => {
  return (
    <MotionPack title="Windows Agent" icon={ExtensionLogo}>
      <Motion.Simple
        name="new-incognito-window"
        title="New Incognito Window"
        keywords={['incognito', 'New Incognito Window']}
        description="Open a new incognito window"
        endAfterRun
        handle={async () => {
          windowAction.openIncognitoWindow();
        }}
      />

      <Motion.Simple
        name="close-current-window"
        title="Close Current Window"
        keywords={['close', 'Close Current Window']}
        description="Close the current window"
        endAfterRun
        handle={async () => {
          windowAction.closeCurrentWindow();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
