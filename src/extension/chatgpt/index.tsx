import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command, CommandPanel } from '~component/cmdk/common/Command';

import { chatgptTopic } from '../../topics/ai';
import { gotoJqueryGPTs } from './goto';
import { checkNewChat, testIt } from './handle';

const TabManagerComand = () => {
  return (
    <CommandPanel title="GPTs" icon={ExtensionLogo} topics={[chatgptTopic]}>
      <Command.SimpleCommand
        name="test"
        title="test"
        keywords={['test']}
        description="test"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      />

      <Command.SimpleCommand
        name="reverse-prompt"
        title="Reverse Prompt"
        keywords={['reversePrompt']}
        description="reversePrompt"
        endAfterRun
        handle={async () => {
          await testIt();
        }} />


      <Command.SimpleCommand
        name="new-chat"
        title="New Chat"
        keywords={['newChat']}
        description="newChat"
        endAfterRun
        handle={async () => {
          await checkNewChat();
        }}
      />

      <Command.SimpleCommand
        name="check-gpts-#1-jquery"
        title="Check GPTs #1 JQuery"
        keywords={['gotoJqueryGPTs']}
        description="gotoJqueryGPTs"
        endAfterRun
        handle={async () => {
          await gotoJqueryGPTs();
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
