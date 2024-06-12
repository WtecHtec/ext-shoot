export interface WaitForTabOptions {
  regex?: string; // 适合需要redirect的情况
  delay?: number; // 适合需要延迟的情况
}

/**
 * Wait for a tab to load
 * @param tabId
 * @param options
 */
export function waitForTabToLoad(tabId, options: WaitForTabOptions = {}) {
  const { regex = null, delay = 0 } = options;
  console.log('regex', regex);
  console.log('options', options);
  return new Promise((resolve) => {
    let timeoutId = null;

    function onTabUpdated(updatedTabId, changeInfo, tabInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        if (regex && tabInfo && tabInfo.url && !new RegExp(regex).test(tabInfo.url)) {
          return;
        }

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (delay > 0) {
          timeoutId = setTimeout(() => {
            console.log(`Tab ${tabId} has loaded with delay.`);
            chrome.tabs.onUpdated.removeListener(onTabUpdated);
            resolve(tabId);
          }, delay);
        } else {
          console.log(`Tab ${tabId} has loaded.`);
          chrome.tabs.onUpdated.removeListener(onTabUpdated);
          resolve(tabId);
        }
      }
    }

    chrome.tabs.onUpdated.addListener(onTabUpdated);
  });
}

/**
 * Check if a tab is loaded
 * @param tabId
 */
export function isTabLoaded(tabId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tab.status === 'complete');
      }
    });
  });
}
