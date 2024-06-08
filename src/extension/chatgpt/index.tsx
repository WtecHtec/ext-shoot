import ExtensionLogo from 'data-base64:./icon.png';
import OpenAIStatusLogo from 'data-base64:./icons/status.png';
import React from 'react';

import { Motion } from '~component/cmdk/extension/command';
import { MotionPack } from '~component/cmdk/extension/command-panel';

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
import { execLastChatBlock, initConversationObserver } from './handle/self-exec';

const TabManagerComand = () => {
  return (
    <MotionPack title="GPTs" icon={ExtensionLogo} topics={[chatgptTopic]}>
      {/* ConversationObserver */}
      {GotoCommandList()}
      {/* execLastChatBlock */}
      <Motion.Simple
        name="exec-last-chat-block"
        title="Exec Last Chat Block"
        keywords={['execLastChatBlock']}
        description="Exec Last Chat Block"
        endAfterRun
        handle={async () => {
          await execLastChatBlock();
        }}
      />

      <Motion.Simple
        name="start-conversation-observer"
        title="Start GPTs Self-Manage Mode"
        keywords={['js', 'exec']}
        endAfterRun
        handle={async () => {
          await initConversationObserver();
        }}
      />

      <Motion.Simple
        name="copy-last-code-block"
        title="Copy Last Code Block"
        keywords={['copyLastCodeBlock']}
        description="Copy Last Code Block"
        endAfterRun
        handle={async () => {
          await copyLastCodeBlock();
        }}
      />

      <Motion.Simple
        name="edit-current-gpts"
        title="Edit Current GPTs"
        keywords={['editCurrentGPTs']}
        description="Edit Current GPTs"
        endAfterRun
        handle={async () => {
          await editCurrentGPTs();
        }}
      />

      <Motion.Navigator
        icon={OpenAIStatusLogo}
        url={'https://status.openai.com/'}
        title={'Check OpenAI Satus'}
        newTab={true}
      />
      <Motion.Simple
        name="reGenerate-last-chat"
        title="ReGenerate Last Chat"
        keywords={['reGenerateLastChat']}
        description="ReGenerate Last Chat"
        endAfterRun
        handle={async () => {
          await reGenerateLastChat();
        }}
      />

      <Motion.Simple
        name="copy-last-chat"
        title="Copy Last Chat"
        keywords={['copyLastChat']}
        description="Copy Last Chat"
        endAfterRun
        handle={async () => {
          await copyLastChat();
        }}
      />

      <Motion.Simple
        name="read-last-chat"
        title="Read Last Chat"
        keywords={['readLastChat']}
        description="Read Last Chat"
        endAfterRun
        handle={async () => {
          await readLastChat();
        }}
      />

      <Motion.Simple
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

      <Motion.Simple
        name="generate-share-link"
        title="Generate Share Link"
        keywords={['generateShareLink']}
        description="generateShareLink"
        endAfterRun
        handle={async () => {
          await generateShareLink();
        }}
      />

      <Motion.Simple
        name="toggle-full-screen"
        title="Toggle Full Screen"
        keywords={['toggleFullScreen']}
        description="toggleFullScreen"
        endAfterRun
        handle={async () => {
          await toggleFullScreen();
        }}
      />

      <Motion.Simple
        name="reverse-prompt"
        title="Reverse Prompt"
        keywords={['reversePrompt']}
        description="reversePrompt"
        endAfterRun
        handle={async () => {
          await chatAndReversePrompt();
        }}
      />

      <Motion.Simple
        name="new-chat"
        title="New Chat"
        keywords={['newChat']}
        description="newChat"
        endAfterRun
        handle={async () => {
          await checkNewChat();
        }}
      />
    </MotionPack>
  );
};

export default TabManagerComand;
