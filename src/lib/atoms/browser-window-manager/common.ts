
/**
 * Open a new incognito window
 */
const openIncognitoWindow = () => {
    console.log('1231', 1231);
    chrome.windows.create({ "incognito": true });
};


/**
 * get current window
 */
const getCurrentWindow = () => {
    return new Promise((resolve) => {
        chrome.windows.getCurrent((window) => {
            resolve(window);
        });
    });
};

/**
 * close the current window
 */
const closeWindow = (window) => {
    chrome.windows.remove(window.id);
};

/**
 * close the current window
 */
const closeCurrentWindow = () => {
    getCurrentWindow().then(closeWindow);
};


/**
 * new window
 */
const newWindow = () => {
    chrome.windows.create();
};

/**
 * new window with tab
 */
const newWindowWithTab = (url) => {
    chrome.windows.create({ "url": url });
};

export const methods = {
    openIncognitoWindow,
    getCurrentWindow,
    closeCurrentWindow,
    newWindow,
    newWindowWithTab,
};