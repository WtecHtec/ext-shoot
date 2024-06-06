import ExtensionLogo from 'data-base64:./icon.png';
import OpenAIStatusLogo from 'data-base64:./icons/status.png';
import React from 'react';

import { Command } from '~component/cmdk/extension/command';
import { CommandPanel } from '~component/cmdk/extension/command-panel';

import { chatgptTopic } from '../../topics/ai';
import { GotoCommandList } from './goto';
import {
  chatAndReversePrompt,
  checkNewChat,
  clearCurrentGPTs,
  copyLastChat,
  copyLastCodeBlock,
  editCurrentGPTs,
  generateShareLink,
  readLastChat,
  reGenerateLastChat,
  toggleFullScreen
} from './handle';
import { initConversationObserver } from './handle/self-exec';

const TabManagerComand = () => {
  return (
    <CommandPanel title="GPTs" icon={ExtensionLogo} topics={[chatgptTopic]}>
      {/* ConversationObserver */}
      <Command.Simple
        name="start-conversation-observer"
        title="Start GPTs Self-Manage Mode"
        keywords={['js', 'exec']}
        endAfterRun
        handle={async () => {
          await initConversationObserver();
        }}
      />

      <Command.Simple
        name="copy-last-code-block"
        title="Copy Last Code Block"
        keywords={['copyLastCodeBlock']}
        description="Copy Last Code Block"
        endAfterRun
        handle={async () => {
          await copyLastCodeBlock();
        }}
      />

      <Command.Simple
        name="edit-current-gpts"
        title="Edit Current GPTs"
        keywords={['editCurrentGPTs']}
        description="Edit Current GPTs"
        endAfterRun
        handle={async () => {
          await editCurrentGPTs();
        }}
      />

      <Command.Navigator
        icon={OpenAIStatusLogo}
        url={'https://status.openai.com/'}
        title={'Check OpenAI Satus'}
        newTab={true}
      />
      {GotoCommandList()}
      <Command.Simple
        name="reGenerate-last-chat"
        title="ReGenerate Last Chat"
        keywords={['reGenerateLastChat']}
        description="ReGenerate Last Chat"
        endAfterRun
        handle={async () => {
          await reGenerateLastChat();
        }}
      />

      <Command.Simple
        name="copy-last-chat"
        title="Copy Last Chat"
        keywords={['copyLastChat']}
        description="Copy Last Chat"
        endAfterRun
        handle={async () => {
          await copyLastChat();
        }}
      />

      <Command.Simple
        name="read-last-chat"
        title="Read Last Chat"
        keywords={['readLastChat']}
        description="Read Last Chat"
        endAfterRun
        handle={async () => {
          await readLastChat();
        }}
      />

      <Command.Simple
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

      <Command.Simple
        name="generate-share-link"
        title="Generate Share Link"
        keywords={['generateShareLink']}
        description="generateShareLink"
        endAfterRun
        handle={async () => {
          await generateShareLink();
        }}
      />

      <Command.Simple
        name="toggle-full-screen"
        title="Toggle Full Screen"
        keywords={['toggleFullScreen']}
        description="toggleFullScreen"
        endAfterRun
        handle={async () => {
          await toggleFullScreen();
        }}
      />

      <Command.Simple
        name="reverse-prompt"
        title="Reverse Prompt"
        keywords={['reversePrompt']}
        description="reversePrompt"
        endAfterRun
        handle={async () => {
          await chatAndReversePrompt();
        }}
      />

      <Command.Simple
        name="new-chat"
        title="New Chat"
        keywords={['newChat']}
        description="newChat"
        endAfterRun
        handle={async () => {
          await checkNewChat();
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
