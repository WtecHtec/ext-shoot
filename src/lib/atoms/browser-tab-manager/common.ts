
const getCurrentTab = async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
};

const reloadTab = () => {
    chrome.tabs.reload();
};

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

const goBack = (tab) => {
    chrome.tabs.goBack(
        tab.index
    );
};

const goForward = (tab) => {
    chrome.tabs.goForward(
        tab.index
    );
};

const duplicateTab = () => {
    getCurrentTab().then((response) => {
        chrome.tabs.duplicate(response.id);
    });
};

const muteTab = (mute) => {
    getCurrentTab().then((response) => {
        chrome.tabs.update(response.id, { "muted": mute });
    });
};

const pinTab = (pin) => {
    getCurrentTab().then((response) => {
        chrome.tabs.update(response.id, { "pinned": pin });
    });
};

const closeTab = (tab) => {
    chrome.tabs.remove(tab.id);
};
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