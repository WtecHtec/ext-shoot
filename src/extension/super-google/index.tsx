import ExtensionLogo from 'data-base64:./icon.png';
import MiTaSoLogo from 'data-base64:./icons/mitaso.png';
import React from 'react';

import { Motion, MotionPack } from '~component/cmdk/extension';
import { GoogleSearchTopic } from '~topics';

import { searchClipboardImage, searchClipboardText, searchInMetaso, translateSearchKeywords } from './handle';

const superGoogle = () => {
  return (
    <MotionPack
      title="SuperGoogle"
      icon={ExtensionLogo}
      // keywords={['']}
      topics={[GoogleSearchTopic]}>
      {/* <Motion.Simple
        name="test"
        title="test Title"
        keywords={['test']}
        description="test Description"
        endAfterRun
        handle={async () => {
          await testIt();
        }}
      /> */}
      <Motion.Simple
        name="translate-search-keywords"
        title="将搜索关键词翻译为英文"
        keywords={['translate', 'search', 'keywords']}
        description="Translate the search keywords into English"
        endAfterRun
        handle={async () => {
          await translateSearchKeywords();
        }}
      />

      <Motion.Simple
        name="search-clipboard-image"
        title="搜索剪贴板图片"
        keywords={['search', 'clipboard', 'image']}
        description="搜索剪贴板图片"
        endAfterRun
        handle={async () => {
          await searchClipboardImage();
        }}
      />

      <Motion.Simple
        name="search-clipboard"
        title="搜索剪贴板内容"
        keywords={['search', 'clipboard']}
        description="搜索剪贴板内容"
        endAfterRun
        handle={async () => {
          searchClipboardText();
        }}
      />

      <Motion.Simple
        icon={MiTaSoLogo}
        name="mitaso"
        title="在秘塔AI中搜索"
        keywords={['mitaso', 'search']}
        description="在秘塔AI中搜索"
        endAfterRun
        handle={async () => {
          await searchInMetaso();
        }}
      />
    </MotionPack>
  );
};

export default superGoogle;
