import toast from '~component/cmdk/toast';
import { executeClipboardScript } from '~extension/devtools/handle';

import { atom } from '../atom-dom-find';
import { copyLastCodeBlock } from '../handle';

// 初始化消息通知函数
function displayNotification(): void {
  toast.info('检测到新消息，正在执行最后一个代码块。');
  execLastChatBlock();
}

let debounceTimer: number | undefined;

function setupInnerObserver(element: Element): void {
  let attempts = 0;
  const maxAttempts = 5;
  let markdownElement = element.querySelector('.markdown');

  // 定义一个函数来尝试找到markdown元素，并在找到后设置观察器
  function attemptToFindMarkdown() {
    if (markdownElement) {
      startObserving(markdownElement);
    } else if (attempts < maxAttempts) {
      setTimeout(() => {
        markdownElement = element.querySelector('.markdown');
        attempts++;
        attemptToFindMarkdown();
      }, 1000); // 每秒重试一次
    } else {
      console.error('Markdown element not found after multiple attempts.');
    }
  }

  // 用于开始观察Markdown元素的函数
  function startObserving(markdownElement: Element) {
    let lastContent = markdownElement.textContent?.trim(); // 初始内容
    const observer = new MutationObserver(() => {
      const currentContent = markdownElement.textContent?.trim();
      if (currentContent !== lastContent) {
        lastContent = currentContent; // 更新最后记录的内容
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          observer.disconnect(); // 断开观察器
          displayNotification(); // 显示当前内容
        }, 2000); // 延迟2秒以确认内容稳定
      }
    });

    observer.observe(markdownElement, {
      childList: true,
      subtree: true,
      characterData: true // 观察文本变化
    });
  }

  attemptToFindMarkdown(); // 开始尝试找到Markdown元素并设置观察器
}

function setupLastOddNodeObserver(): void {
  const lastOddNode = atom.chatgpt.findLastChatBlock().get(0);
  if (lastOddNode) {
    console.log('lastOddNode', lastOddNode);
    setupInnerObserver(lastOddNode);
  } else {
    console.error('没有找到任何奇数元素。');
  }
}

export function initConversationObserver(): void {
  const targetNode = atom.chatgpt.findChatContainer(); // 获取目标节点
  console.log('targetNode', targetNode);

  // 初始化时立即对最后一个奇数元素设置观察器
  setupLastOddNodeObserver();

  const config: MutationObserverInit = {
    childList: true,
    subtree: true
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node instanceof HTMLElement) {
          const testId = node.dataset.testid;
          if (testId && testId.startsWith('conversation-turn-')) {
            const numberPart = testId.split('-').pop();
            if (numberPart && parseInt(numberPart) % 2 !== 0) {
              setupInnerObserver(node); // 对符合条件的新元素设置内部观察器
            }
          }
        }
      });
    });
  });

  if (targetNode) {
    observer.observe(targetNode.get(0), config); // 对目标节点应用配置并开始观察
  } else {
    console.error('无法找到目标元素。');
  }
}

export async function execLastChatBlock() {
  await copyLastCodeBlock();
  // 复制到剪贴板， 读取剪贴板内容
  // const script = await navigator.clipboard.readText();
  // 跨 motion 调用？

  await executeClipboardScript();

  // console.log('script', script);
}
