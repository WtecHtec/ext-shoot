/**
 * Open a new incognito window
 */
const openIncognitoWindow = () => {
    browser.windows.create({ "incognito": true });
};


/**
 * get current window
 */
const getCurrentWindow = () => {
    return browser.windows.getCurrent();
};

/**
 * close the current window
 */
const closeWindow = (window) => {
    browser.windows.remove(window.id);
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
    browser.windows.create();
};

/**
 * new window with tab
 */
const newWindowWithTab = (url) => {
    browser.windows.create({ "url": url });
};
export const methods = {
    openIncognitoWindow,
    getCurrentWindow,
    closeCurrentWindow,
    newWindow,
    newWindowWithTab,
};