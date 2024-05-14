/**
 * 获取指定域名的cookie
 * @param domain 
 * @returns 
 */
const getAllCookiesByDomain = async (domain: string): Promise<chrome.cookies.Cookie[]> => {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll({ domain }, (cookies) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                console.log('Cookies:', cookies);
                resolve(cookies);
            }
        });
    });
};

/**
 * 获取所有网站的cookie
 * @returns 返回一个包含所有网站cookie的对象数组
 */
const getAllCookies = async (): Promise<chrome.cookies.Cookie[]> => {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll({}, (cookies) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(cookies);
            }
        });
    });
};


export const methods = {
    getAllCookiesByDomain,
    getAllCookies
};