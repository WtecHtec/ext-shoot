import ExtensionLogo from 'data-base64:./icon.png';
import React from 'react';

import { Command } from '~component/cmdk/extension/command';
import { CommandPanel } from '~component/cmdk/extension/command-panel';

import { chatgptTopic } from '../../topics/ai';
import { gotoJqueryGPTs, newToGPT4 } from './goto';
import {
  chatAndReversePrompt,
  checkNewChat,
  clearCurrentGPTs,
  copyLastChat,
  generateShareLink,
  readLastChat,
  reGenerateLastChat,
  testIt,
  toggleFullScreen
} from './handle';

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

      <Command.Navigator url="https://www.google.com" title="goto-google22" />

      <Command.SimpleCommand
        name="reGenerate-last-chat"
        title="ReGenerate Last Chat"
        keywords={['reGenerateLastChat']}
        description="ReGenerate Last Chat"
        endAfterRun
        handle={async () => {
          await reGenerateLastChat();
        }}
      />

      <Command.SimpleCommand
        name="copy-last-chat"
        title="Copy Last Chat"
        keywords={['copyLastChat']}
        description="Copy Last Chat"
        endAfterRun
        handle={async () => {
          await copyLastChat();
        }}
      />

      <Command.SimpleCommand
        name="read-last-chat"
        title="Read Last Chat"
        keywords={['readLastChat']}
        description="Read Last Chat"
        endAfterRun
        handle={async () => {
          await readLastChat();
        }}
      />

      <Command.SimpleCommand
        name="new-to-gpt4"
        title="New GPT-4 Page"
        keywords={['newToGPT4']}
        description="newToGPT4"
        endAfterRun
        handle={async () => {
          newToGPT4();
        }}
      />

      <Command.SimpleCommand
        name="clear-now-gpts"
        title="Clear Now GPTs"
        keywords={['clearNowGPTs']}
        description="clearNowGPTs"
        endAfterRun
        handle={async () => {
          // Add your function here
          await clearCurrentGPTs();
        }}
      />

      <Command.SimpleCommand
        name="generate-share-link"
        title="Generate Share Link"
        keywords={['generateShareLink']}
        description="generateShareLink"
        endAfterRun
        handle={async () => {
          await generateShareLink();
        }}
      />

      <Command.SimpleCommand
        name="toggle-full-screen"
        title="Toggle Full Screen"
        keywords={['toggleFullScreen']}
        description="toggleFullScreen"
        endAfterRun
        handle={async () => {
          await toggleFullScreen();
        }}
      />

      <Command.SimpleCommand
        name="reverse-prompt"
        title="Reverse Prompt"
        keywords={['reversePrompt']}
        description="reversePrompt"
        endAfterRun
        handle={async () => {
          await chatAndReversePrompt();
        }}
      />

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
