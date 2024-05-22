import $ from 'jquery';

/**
 * 判断是否登陆
 * @label dom
 * @returns {boolean} 如果已经登陆返回true，否则返回false
 */

export function isLoggedIn(): boolean {
    return !$('.note-login button').text().includes('登录');
}

