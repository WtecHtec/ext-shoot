import ExtensionLogo from "data-base64:./icon.jpg";
import React from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";

import { getUser } from "./download-all-post";
import { toggleTranslateToCnMode } from "./handle";
import { switchAccount } from "./switch-account";
import { switchTheme } from "./switch-theme";

const TabManagerComand = () => {
  return (
    <CommandPanel title="Jiker" icon={ExtensionLogo}>
      {/* <Command.SimpleCommand
        name="new-post-page"
        title="Open New Post Page"
        keywords={["new post", "Open New Post Page"]}
        description="Open Jike's new post page"
        endAfterRun
        handle={checkPostCreatePage}
      /> */}
      <Command.SimpleCommand
        name="switch-account"
        title="换个账户登陆"
        keywords={["switch account", "切换账户"]}
        description="切换到另一个账户"
        endAfterRun
        handle={switchAccount}
      />
      <Command.SimpleCommand
        name="switch-theme"
        title="换个主题吧"
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

      <Command.SimpleCommand
        name="test-action"
        title="测试动作"
        keywords={["test action", "测试"]}
        description="执行一个简单的测试动作"
        endAfterRun
        handle={() => {
          getUser();
        }}
      />
    </CommandPanel>
  );
};

export default TabManagerComand;
