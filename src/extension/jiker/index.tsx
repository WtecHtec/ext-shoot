import ExtensionLogo from "data-base64:./icon.jpg";
import React from "react";

import { Command, CommandPanel } from "~component/cmdk/common/Command";
// import DataManager from "~lib/atoms/browser-cache-manager"
import TabManager from "~lib/atoms/browser-tab-manager";
import $ from 'jquery';
import { TranslateToCn } from "./handle";


// const dataAction = DataManager.action;
const tabAction = TabManager.action;

const TabManagerComand = () => {
  return (
    <CommandPanel title="Jiker" icon={ExtensionLogo}>
      <Command.SimpleCommand
        name="new-post-page"
        title="Open New Post Page"
        keywords={["new post", "Open New Post Page"]}
        description="Open Jike's new post page"
        endAfterRun
        handle={async () => {
          tabAction.changeCurrentTabUrl("https://web.okjike.com");
        }}
      />

      <Command.SimpleCommand
        name="test"
        title="沉浸式翻译"
        keywords={["test", "inject jquery"]}
        description="inject jquery"
        endAfterRun
        handle={async () => {
          let rawContentEle;
          $(document).ready(function () {
            // 绑定 hover 事件到所有元素
            $('.border-tint-border').hover(function () {
              // 鼠标移入，获取当前元素
              const hoveredElement = $(this);
              const contentEle = hoveredElement.find("[class*='content_truncate']");
              rawContentEle = contentEle.html();
              TranslateToCn(contentEle);
            }, function () {
              const hoveredElement = $(this);
              //find the content element, and change it back to the original content
              const contentEle = hoveredElement.find("[class*='content_truncate']");
              contentEle.html(rawContentEle);
            });
          });

        }}
      />

      {/* // stop listening */}
      <Command.SimpleCommand
        name="stop-listening"
        title="Stop Listening"
        keywords={["stop listening", "stop"]}
        description="Stop listening"
        endAfterRun
        handle={async () => {
          $(document).ready(function () {
            $('.border-tint-border').off('mouseenter mouseleave');
          });
        }}
      />

    </CommandPanel>
  );
};

export default TabManagerComand;
