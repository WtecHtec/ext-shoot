
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
    chrome.windows.update(
        tab.windowId,
        { focused: true }
    );
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
        chrome.tabs.update(response.id, { "pinned": pin });
    });
};

const togglePinTab = () => {
    getCurrentTab().then((response) => {
        chrome.tabs.update(response.id, { "pinned": !response.pinned });
    });
};

/**
 * Close the given tab
 * @param tab The tab to close
 */
const closeTab = (tab) => {
    chrome.tabs.remove(tab.id);
};

/**
 * Close the current tab
 */
const closeCurrentTab = () => {
    getCurrentTab().then(closeTab);
};


const openLastClosedTab = () => {
    chrome.sessions.restore(null, (session) => {
        if (session && session.tab) {
            console.log("Last closed tab reopened successfully:", session.tab);
        } else {
            console.log("Failed to reopen the last closed tab.");
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
    createTab("chrome://newtab/");
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

const executeScriptInTab = async (tabId, script) => {
    console.log("Start executing script...");
    console.log("Script:", script);

    try {
        const result = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: (script) => {
                const resultIdentifier = "__scriptExecutionResult_" + Date.now();

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
            world: 'MAIN',
        });

        console.log("Script execution successful. Results:", result);
        return result[0].result;
    } catch (error) {
        console.error("Error during script execution:", error);
        throw error;
    }
};


export const methods = {
    getCurrentTab,
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
    executeScriptInTab
};