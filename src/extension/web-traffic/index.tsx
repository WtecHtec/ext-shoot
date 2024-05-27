import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command, CommandPanel } from '~component/cmdk/common/Command';

import { checkTraffic } from './handle';

const TabManagerComand = () => {
  return (
    <CommandPanel title="Web Traffic" icon={ExtensionLogo}>
      <Command.SimpleCommand
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
