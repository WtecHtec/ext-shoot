import ExtensionLogo from "data-base64:./icon.jpg";
import React from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";

import { gotoPageCollection, gotoPageHome, gotoPageMe, gotoPageRecommend, showNotification, testHandle, toggleTranslateToCnMode } from "./handle";
import { switchAccount } from "./switch-account";
import { switchTheme } from "./switch-theme";
import { reEditPost } from "./change-post";
import { exportUserPosts } from "./export-post";
import { clearUserPosts } from "./clear-post";
import { copyContentToClipboard } from "./copy-post";
import { saveContentToFlomo } from "./export-flomo";

const TabManagerComand = () => {
  return (
    <CommandPanel title="Jiker" icon={ExtensionLogo}>

      <Command.SimpleCommand
        name="test-handle"
        title="测试"
        keywords={["test handle", "测试"]}
        description="测试"
        endAfterRun
        handle={testHandle}
      />


      <Command.SimpleCommand
        name="save-flomo"
        title="保存帖子到 Flomo"
        keywords={["flomo", "保存flomo"]}
        description="在Flomo中保存当前帖子内容"
        endAfterRun
        handle={async () => {
          await saveContentToFlomo();
        }}
      />

      <Command.SimpleCommand
        name="copy-content"
        title="复制帖子内容到剪贴板"
        keywords={["copy content", "复制内容"]}
        description="将当前内容复制到剪贴板"
        endAfterRun
        handle={() => {
          copyContentToClipboard();
        }}
      />
      <Command.SimpleCommand
        name="clear-posts"
        title="清空我的历史博客"
        keywords={["clear posts", "清除博客"]}
        description="清空当前用户的所有历史博客"
        endAfterRun
        handle={() => {
          clearUserPosts();
        }}
      />


      <Command.SimpleCommand
        name="export-person-blog"
        title="把这个同志的所有博客导出一份表格给我"
        keywords={["export blog", "导出博客"]}
        description="导出当前用户的博客"
        endAfterRun
        handle={() => {
          exportUserPosts();
        }}
      />

      <Command.SimpleCommand
        name="test-action"
        title="测试动作"
        keywords={["test action", "测试"]}
        description="执行一个简单的测试动作"
        endAfterRun
        handle={() => {
          clearUserPosts();
        }}
      />


      <Command.SimpleCommand
        name="go-home-page"
        title="去首页逛逛"
        keywords={["home", "回到首页"]}
        description="回到即刻的首页"
        endAfterRun
        handle={gotoPageHome}
      />
      <Command.SimpleCommand
        name="go-me-page"
        title="去我的个人页面"
        keywords={["me", "进入我的主页"]}
        description="进入我的个人主页"
        endAfterRun
        handle={gotoPageMe}
      />
      <Command.SimpleCommand
        name="go-recommend-page"
        title="去推荐页瞧瞧"
        keywords={["recommend", "查看推荐页"]}
        description="查看即刻推荐内容"
        endAfterRun
        handle={gotoPageRecommend}
      />
      <Command.SimpleCommand
        name="go-collection-page"
        title="去我的收藏"
        keywords={["collection", "查看我的收藏"]}
        description="查看我收藏的帖子"
        endAfterRun
        handle={gotoPageCollection}
      />
      <Command.SimpleCommand
        name="trigger-notification"
        title="看看通知"
        keywords={["notification", "触发通知"]}
        description="显示即刻通知"
        endAfterRun
        handle={showNotification}
      />

      <Command.SimpleCommand
        name="re-edit-post"
        title="这文案真不行，重新编辑再发布"
        keywords={["edit post", "编辑帖子"]}
        description="编辑当前帖子然后重新发布"
        endAfterRun
        handle={reEditPost}
      />
      <Command.SimpleCommand
        name="switch-account"
        title="换一个账户登陆"
        keywords={["switch account", "切换账户"]}
        description="切换到另一个账户"
        endAfterRun
        handle={switchAccount}
      />
      <Command.SimpleCommand
        name="switch-theme"
        title="换一个主题"
        keywords={["switch theme", "切换主题"]}
        description="切换到另一个主题"
        endAfterRun
        handle={switchTheme}
      />

      <Command.SimpleCommand
        name="test"
        title="沉浸式翻译"
        keywords={["沉浸式翻译", "翻译"]}
        description="inject jquery"
        endAfterRun
        handle={toggleTranslateToCnMode}
      />


    </CommandPanel>
  );
};

export default TabManagerComand;
