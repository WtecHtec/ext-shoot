
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
 * @param tab The tab to go back in
 */
const goBack = (tab) => {
    chrome.tabs.goBack(
        tab.index
    );
};

/**
 * Go forward in the tab history
 * @param tab The tab to go forward in
 */
const goForward = (tab) => {
    chrome.tabs.goForward(
        tab.index
    );
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
 * Mute the current tab
 * @param mute Whether to mute the tab
 */
const muteTab = (mute) => {
    getCurrentTab().then((response) => {
        chrome.tabs.update(response.id, { "muted": mute });
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


export const methods = {
    getCurrentTab,
    reloadTab,
    switchTab,
    goBack,
    goForward,
    duplicateTab,
    muteTab,
    pinTab,
    closeTab,
    closeCurrentTab,
};