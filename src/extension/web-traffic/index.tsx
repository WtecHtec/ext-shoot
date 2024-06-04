import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command } from '~component/cmdk/extension/command';
import { CommandPanel } from '~component/cmdk/extension/command-panel';

import { checkTraffic } from './handle';

const TabManagerComand = () => {
  return (
    <CommandPanel title="Web Traffic" icon={ExtensionLogo}>
      <Command.Simple
        name="web-traffic"
        title="Go Similarweb"
        keywords={['web traffic', 'web']}
        description="Open the browser's web traffic page"
        endAfterRun
        handle={async () => {
          await checkTraffic();
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
