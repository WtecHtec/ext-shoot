import $ from 'jquery';

import TabManager from '~lib/atoms/browser-tab-manager';
import { postTask } from '~lib/exec-task-to-web';

const tabAction = TabManager.action;

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
  const result = await triggerMouseEvent("div[id^='radix-'][aria-haspopup='menu']");
  console.log('result', result);
}
