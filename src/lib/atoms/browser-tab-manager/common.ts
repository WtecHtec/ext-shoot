/**
 * Get the current tab
 * @returns The current tab
 */
const getCurrentTab = async () => {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

/**
 * Get current tab id
 * @returns The current tab id
 */

const getCurrentTabId = async () => {
  const tab = await getCurrentTab();
  return tab.id;
};

/**
 * Reload the current tab
 */
const reloadTab = () => {
  chrome.tabs.reload();
};

/**
 * Switch to the given tab
 * @param tab The tab to switch to
 */
const switchTab = (tab) => {
  chrome.tabs.highlight({
    tabs: tab.index,
    windowId: tab.windowId
  });
  chrome.windows.update(tab.windowId, { focused: true });
};

/**
 * Go back in the tab history
 * @param tab The tab id to go back in
 */
const goBack = (tab) => {
  chrome.tabs.goBack(tab.id);
};

const currentGoBack = () => {
  getCurrentTab().then((response) => {
    chrome.tabs.goBack(response.id);
  });
};

/**
 * Go forward in the tab history
 * @param tab The tab to go forward in
 */
const goForward = (tab) => {
  chrome.tabs.goForward(tab.id);
};

const currentGoForward = () => {
  getCurrentTab().then((response) => {
    chrome.tabs.goForward(response.id);
  });
};

/**
 * Duplicate the current tab
 */
const duplicateTab = () => {
  getCurrentTab().then((response) => {
    chrome.tabs.duplicate(response.id);
  });
};

/**
 * Pin the current tab
 * @param pin Whether to pin the tab
 */
const pinTab = (pin) => {
  getCurrentTab().then((response) => {
    chrome.tabs.update(response.id, { pinned: pin });
  });
};

const togglePinTab = () => {
  getCurrentTab().then((response) => {
    chrome.tabs.update(response.id, { pinned: !response.pinned });
  });
};

/**
 * Close the given tab
 * @param tab The tab to close
 */
const closeTab = (tabId) => {
  chrome.tabs.remove(tabId);
};

/**
 * Close the current tab
 */
const closeCurrentTab = () => {
  getCurrentTab().then((response) => {
    closeTab(response.id);
  });
};

const openLastClosedTab = () => {
  chrome.sessions.restore(null, (session) => {
    if (session && session.tab) {
      console.log('Last closed tab reopened successfully:', session.tab);
    } else {
      console.log('Failed to reopen the last closed tab.');
    }
  });
};

/**
 * mute the current tab
 */
export const toggleMuteTab = () => {
  getCurrentTab().then((response) => {
    chrome.tabs.update(response.id, { muted: !response.mutedInfo.muted });
  });
};

/**
 * create a new tab with the given url
 */
export const createTab = (url) => {
  chrome.tabs.create({ url });
};

/**
 * create blank tab
 */
export const createBlankTab = () => {
  createTab('chrome://newtab/');
};

// change current tab url
export const changeCurrentTabUrl = (url) => {
  getCurrentTab().then((response) => {
    chrome.tabs.update(response.id, { url });
  });
};

/**
 * inject script js
 */
const injectJQuery = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['jquery.min.js']
  });
};

//inject current tab Jquery
export const injectCurrentTabJQuery = () => {
  getCurrentTab().then((response) => {
    injectJQuery(response.id);
  });
};

export const createTabInactive = (url) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url, active: false }, (tab) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tab.id);
      }
    });
  });
};

export const createTabAndCheckIn = (url) => {
  chrome.tabs.create({ url }, (tab) => {
    chrome.tabs.update(tab.id, { active: true });
  });
};

export const createTabNextToCurrent = (url) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.tabs.create({ url, index: currentTab.index + 1 }, (tab) => {
      chrome.tabs.update(tab.id, { active: true });
    });
  });
};

function waitForTabToLoad(tabId) {
  return new Promise((resolve) => {
    function onTabUpdated(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        console.log(`Tab ${tabId} has loaded.`);
        chrome.tabs.onUpdated.removeListener(onTabUpdated); // 移除监听器避免重复调用
        resolve(1); // 解决Promise
      }
    }
    chrome.tabs.onUpdated.addListener(onTabUpdated);
  });
}

export const invokeFunctionInTab = async (tabId, functionName, args) => {
  try {
    await waitForTabToLoad(tabId); // 等待标签页加载完成
    console.log('tabId', tabId, 'Sending message to tab.');
    console.log('tabId', tabId, 'functionName', functionName, 'args', args);
    const response = await chrome.tabs.sendMessage(tabId, {
      type: 'invokeFunction',
      functionName: functionName,
      args: args
    });
    console.log('Function invocation response:', response);
    return response; // 返回函数调用结果
  } catch (error) {
    console.error('Error invoking function:', error.message);
    throw error; // 抛出异常以便外部捕获
  }
};

const executeScriptInTab = async (tabId, script) => {
  console.log('Start executing script...');
  console.log('Script:', script);

  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (script) => {
        const resultIdentifier = '__scriptExecutionResult_' + Date.now();

        // Wrap the script to store the result in window object
        const wrappedScript = `
            (function() {
                try {
                    console.log("Executing script...");
                    // Store the result in window object
                    window.${resultIdentifier} = (${script})();
                    console.log(result,window.${resultIdentifier})
                } catch (error) {
                    console.error("Script execution error:", error);
                    throw error;
                }
            })();
        `;

        // Create a script element
        const scriptElement = document.createElement('script');
        // Set the content of the script element to the wrapped script
        scriptElement.textContent = wrappedScript;

        // Append the script element to the document to execute the script
        document.documentElement.appendChild(scriptElement);

        // Remove the script element after execution
        scriptElement.remove();

        // Retrieve the result from window object
        return window[resultIdentifier];
      },
      args: [script],
      world: 'MAIN'
    });

    console.log('Script execution successful. Results:', result);
    return result[0].result;
  } catch (error) {
    console.error('Error during script execution:', error);
    throw error;
  }
};

const TabLoadFilterMap = {
  jikeexportfeishu: (tabid, changeInfo, tab) => {
    const pendingUrl = tab?.url || '';
    const feishuRegex = /https:\/\/([a-zA-Z0-9]+).feishu.cn\/base\/([a-zA-Z0-9]+)\?table=([a-zA-Z0-9]+)/;
    const matchs = pendingUrl?.match(feishuRegex);
    // console.log('测试---', matchs);
    if (matchs && matchs.length >= 3) {
      return true;
    }
    return false;
  }
};
function waitForTabToLoadFinal(tabId, filter) {
  return new Promise((resolve) => {
    function onTabUpdated(updatedTabId, changeInfo, tabInfo) {
      console.log(`Tab ${tabId} has loaded.`, updatedTabId, filter);
      if (changeInfo.status === 'complete') {
        if (
          typeof TabLoadFilterMap[filter] === 'function' &&
          TabLoadFilterMap[filter](updatedTabId, changeInfo, tabInfo)
        ) {
          chrome.tabs.onUpdated.removeListener(onTabUpdated); // 移除监听器避免重复调用
          resolve(updatedTabId); // 解决Promise
        }
      }
    }
    chrome.tabs.onUpdated.addListener(onTabUpdated);
  });
}

const invokeFunctionInTabFilter = async (tabId, functionName, filter, args) => {
  try {
    console.log('invokeFunctionInTabFilter---', tabId, 'functionName', functionName, 'filter', filter, 'args', args);
    tabId = await waitForTabToLoadFinal(tabId, filter); // 等待标签页加载完成
    console.log('tabId', tabId, 'Sending message to tab.');
    console.log('tabId', tabId, 'functionName', functionName, 'args', args);
    const response = await chrome.tabs.sendMessage(tabId, {
      type: 'invokeFunction',
      functionName: functionName,
      args: args
    });
    console.log('Function invocation response:', response);
    return response; // 返回函数调用结果
  } catch (error) {
    console.error('Error invoking function:', error.message);
    throw error; // 抛出异常以便外部捕获
  }
};

export const methods = {
  getCurrentTab,
  getCurrentTabId,
  reloadTab,
  switchTab,
  goBack,
  currentGoBack,
  goForward,
  currentGoForward,
  duplicateTab,
  pinTab,
  togglePinTab,
  closeTab,
  closeCurrentTab,
  openLastClosedTab,
  toggleMuteTab,
  createTab,
  createBlankTab,
  changeCurrentTabUrl,
  injectCurrentTabJQuery,
  createTabInactive,
  createTabAndCheckIn,
  executeScriptInTab,
  invokeFunctionInTab,
  invokeFunctionInTabFilter,
  createTabNextToCurrent
};
