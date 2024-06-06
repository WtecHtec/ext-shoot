import { atom } from '../atom-dom-find';

// 初始化消息通知函数
function displayNotification(content: string): void {
  console.log(`新消息通知: ${content}`);
}

let debounceTimer: number | undefined;

function setupInnerObserver(element: Element): void {
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      // 直接获取并显示最终的元素内容
      const content = element.textContent?.trim() ?? '';
      displayNotification(content);
    }, 1000);
  });

  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 定时器自动断开观察器，防止无限期观察
  setTimeout(() => {
    observer.disconnect();
  }, 10000); // 10秒后自动停止，根据情况调整
}

// 创建并初始化一个 MutationObserver 实例来监听 DOM 变化
export function initConversationObserver(): void {
  const targetNode = atom.chatgpt.findChatContainer(); // 获取目标节点
  console.log('targetNode', targetNode);

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
