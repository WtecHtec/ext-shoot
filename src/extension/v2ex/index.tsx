import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command, CommandPanel } from '~component/cmdk/common/Command';
import { V2exTopic } from '~topics';

import { handleVexSign } from './handle';

const TabManagerComand = () => {
  return (
    <CommandPanel title="V2ex" icon={ExtensionLogo} topics={[V2exTopic]}>
      <Command.SimpleCommand
        name="v2ex-sign"
        title="帮我去签到"
        keywords={['sign', '签到', 'v2ex签到']}
        description="v2ex签到"
        endAfterRun
        handle={async () => {
          await handleVexSign();
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
