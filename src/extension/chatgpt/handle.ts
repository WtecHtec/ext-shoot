import $ from 'jquery';

import toast from '~component/cmdk/toast';
import TabManager from '~lib/atoms/browser-tab-manager';
import WebInteraction from '~lib/atoms/web-common-Interaction';
import { Job, newJob } from '~lib/dom-exec-engine/exec-engine';
import { postTask } from '~lib/exec-task-to-web';

import { atom } from './atom-dom-find';
import { getLastChatCodeCopyBtn } from './handle/chat';
import { buildGPTsEditorUrl, extractGPTsId, isGTPsPage, pageUrl } from './link';
import { promptList } from './prompt';

const tabAction = TabManager.action;
const webAction = WebInteraction.action;

/**
 *
 * @returns {
 * screenName: string,
 * username: string,
 * }
 */

export async function getCurrentUserProfile() {
  // alert(`当前用户是：${name}`);
  const result = (await postTask('(function() { return window.__NEXT_DATA__.props.pageProps.user.email; })()')) as any;
  // filter
  return result;
}

/**
 * 获取元素中心的绝对位置，支持跨 iframe 和多窗口环境。
 * @param {Element} element - 目标元素
 * @returns {Promise<{x: number, y: number}>} 返回元素中心的位置
 */
export async function getAbsoluteElementCenter(element) {
  const doc = element.ownerDocument;
  const win = doc.defaultView || window;
  const rect = element.getBoundingClientRect();

  // 计算元素中心点相对于当前视口的位置
  const position = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };

  // 如果元素所在的窗口不是顶层窗口，需要考虑 iframe 偏移
  if (win !== window.top) {
    try {
      let currentWindow = win;
      while (currentWindow !== window.top) {
        const frameElement = currentWindow.frameElement;
        const frameRect = frameElement.getBoundingClientRect();

        // 更新位置，加上当前 iframe 的偏移
        position.x += frameRect.left;
        position.y += frameRect.top;

        currentWindow = frameElement.ownerDocument.defaultView;
      }
    } catch (error) {
      console.error('Error while calculating position in iframes:', error);
      return position; // 发生错误时返回当前计算的位置
    }
  }

  return position;
}

/**
 * 使用 jQuery 选择器获取元素的中心绝对位置。
 * @param {string} selector - jQuery 选择器字符串
 * @returns {Promise<{x: number, y: number}>} 返回元素中心的位置
 */
export async function getCenterPositionBySelector(selector) {
  // 使用 jQuery 选择器找到第一个匹配的元素
  const element = $(selector).get(0);

  if (!element) {
    console.error('No element found for the given selector:', selector);
    return null;
  }

  // 调用之前定义的函数获取元素的中心位置
  return getAbsoluteElementCenter(element);
}

export async function triggerMouseEvent(selector: string): Promise<void> {
  const position = await getCenterPositionBySelector(selector);
  console.log('position', position);
  const tabId = await tabAction.getCurrentTabId();
  chrome.runtime.sendMessage({
    type: 'simulateMouseEvent',
    tabId: tabId,
    params: {
      type: 'mousePressed',
      x: position.x,
      y: position.y,
      button: 'left',
      clickCount: 1
    }
  });
}

export async function testIt() {
  const result = (await postTask('(function() { copy([1,2,3]) })()')) as any;

  console.log('result', result);
}

export async function chatAndReversePrompt() {
  await newJob()
    .next(async (ctx) => {
      const inputArea = await ctx.finder.query('#prompt-textarea');
      await webAction.triggerFromElement.typeText(inputArea.toDom() as HTMLInputElement, {
        value: promptList.reverse
      });
    })
    .next(async () => {
      const buttonElement = $('button[data-testid="fruitjuice-send-button"]');
      webAction.triggerFromCursor.clickElement(buttonElement.get(0));
    })
    .do();
  return true;
}

export async function checkNewChat() {
  return newJob()
    .next(async (ctx) => {
      const newChatBtn = await ctx.finder.query('span:nth-of-type(2) > button > svg');
      webAction.triggerFromCursor.clickElement(newChatBtn.toDom());
    })
    .do();
}

export async function toggleFullScreen() {
  await newJob()
    .next(async (ctx) => {
      const fullScreenBtn = await ctx.finder.query('span:nth-of-type(1) > button > svg');
      webAction.triggerFromCursor.clickElement(fullScreenBtn.toDom());
    })
    .do();
}

export const generateShareLink = async () => {
  await new Job()
    .next(async (ctx) => {
      const chatBtn = await ctx.finder.withFunc(atom.chatgpt.findShareBtn);
      console.log('chatBtn', chatBtn);
      if (chatBtn.element.length === 0) {
        throw new Error('没有找到分享按钮');
      }
      webAction.triggerFromCursor.clickElement(chatBtn.toDom());
    })
    .next(async (ctx) => {
      const updateLink = await ctx.finder.query('button.btn', {
        delay: 300,
        maxAttempts: 10
      });
      webAction.triggerFromCursor.clickElement(updateLink.toDom());
    })
    .next(
      async (ctx) => {
        const closeBtn = await ctx.finder.query(
          'div[role="dialog"]:first button.text-token-text-tertiary.hover\\:text-token-text-secondary',
          {
            delay: 300,
            maxAttempts: 2
          }
        );
        webAction.triggerFromCursor.clickElement(closeBtn.toDom());
      },
      {
        errorHandler: async () => {
          toast.error('当前没有可以分享的对话');
        }
      }
    )
    .error(async () => {
      toast('生成分享链接失败');
    })
    .success(async () => {
      toast.success('链接已复制到剪贴板');
    })
    .do();
};

export const clearCurrentGPTs = async () => {
  newJob()
    .must(async () => isGTPsPage(pageUrl()), {
      errorHandler: async () => {
        toast.error('当前页面不是 GPTs 页面');
      }
    })
    .next(async (ctx) => {
      const GPTsBtn = await ctx.finder.query('div[id^="radix-"][aria-haspopup="menu"]');
      GPTsBtn.element.focus();
      ctx.GPTsBtn = GPTsBtn.toDom();
    })
    .next(async (ctx) => {
      const keyDownEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        keyCode: 13,
        view: window
      });
      ctx.GPTsBtn.dispatchEvent(keyDownEvent);
    })
    .next(async (ctx) => {
      const clearBtn = await ctx.finder.withFunc(() => {
        return $('div[data-radix-popper-content-wrapper] div[role="menuitem"]').first();
      });
      webAction.triggerFromCursor.clickElement(clearBtn.toDom());
    })
    .do();
};

export const reGenerateLastChat = async () => {
  await newJob()
    .next(async (ctx) => {
      const regenerateBtn = await ctx.finder.withFunc(atom.chatgpt.findChatReloadBtn);
      webAction.triggerFromCursor.clickElement(regenerateBtn.toDom());
    })
    .do();
};

export const copyLastChat = async () => {
  await newJob()
    .next(async (ctx) => {
      const copyBtn = await ctx.finder.withFunc(atom.chatgpt.findCopyBtn);
      copyBtn.element.focus();
      webAction.triggerFromCursor.clickElement(copyBtn.toDom());
      copyBtn.element.blur();
    })
    .do();
};

export const readLastChat = async () => {
  await newJob()
    .next(async (ctx) => {
      const readBtn = await ctx.finder.withFunc(atom.chatgpt.findReadBtn);
      webAction.triggerFromCursor.clickElement(readBtn.toDom());
    })
    .do();
};

export const editCurrentGPTs = async () => {
  await newJob()
    .must(async () => isGTPsPage(pageUrl()), {
      errorHandler: async () => {
        toast.error('当前页面不是 GPTs 页面');
      }
    })
    .next(async (ctx) => {
      const nowGPTsId = extractGPTsId();
      // todo: 有没有编辑权限？
      const editGPTsURL = buildGPTsEditorUrl(nowGPTsId);
      toast.success('编辑当前 GPTs', {
        description: editGPTsURL
      });
      ctx.newUrl = editGPTsURL;
    })

    .next(async (ctx) => {
      await tabAction.createTabNextToCurrent(ctx.newUrl);
    })
    .do();
};

export const copyLastCodeBlock = async () => {
  await newJob()
    .next(async (ctx) => {
      const lastCopy = await ctx.finder.withFunc(getLastChatCodeCopyBtn);
      lastCopy.element.focus();
      webAction.triggerFromCursor.clickElement(lastCopy.toDom());
    })
    .do();
};
