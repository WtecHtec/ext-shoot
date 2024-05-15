
/**
 * 判断当前URL是否为用户详情页
 * 支持的URL格式:
 * - https://web.okjike.com/u/{userId}
 * @returns {boolean} 如果是用户详情页返回true，否则返回false
 */
export function isUserDetailPage() {
    const url = window.location.href;
    const userDetailRegex = /https:\/\/web\.okjike\.com\/u\/[0-9a-zA-Z-]+$/;
    return userDetailRegex.test(url);
}

/**
 * 从当前URL中提取用户ID
 * 只从用户详情页的URL格式中提取
 * @label: user.dom
 * @returns {string|null} 返回用户ID或者null
 */
export function extractUserIdFromUrl() {
    const url = window.location.href;
    const match = url.match(/https:\/\/web\.okjike\.com\/u\/([0-9a-zA-Z-]+)$/);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}


