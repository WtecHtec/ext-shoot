const clearAllCacheByURL = async (url: string) => {
    await chrome.browsingData.remove(
        { origins: [url], since: 0 },
        { cookies: true, cache: true, cacheStorage: true }
    );
    return true;

};

export const methods = {
    clearAllCacheByURL,
};