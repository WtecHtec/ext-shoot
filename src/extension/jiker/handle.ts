// Function to find and return elements with a class that includes 'content_truncate'
import $ from 'jquery';
import { LRUCache } from 'lru-cache';
import TabManager from "~lib/atoms/browser-tab-manager";
import { postTask } from '~lib/exec-task-to-web';
import cookieManager from '~lib/atoms/browser-cookie-manager';
import toast from '~component/cmdk/toast';
import { getPostDetails } from './api';
import { buildCrossTab } from '~lib/function-manager';

const cookieActions = cookieManager.action;
// Function to perform translation

// support lang
// https://github.com/plainheart/bing-translate-api/blob/HEAD/src/config.json#L9-L30

const tabAction = TabManager.action;

export function gotoPageHome() {
    tabAction.changeCurrentTabUrl("https://web.okjike.com");
}

export function gotoPageMe() {
    tabAction.changeCurrentTabUrl("https://web.okjike.com/me");
}

export function gotoPageRecommend() {
    tabAction.changeCurrentTabUrl("https://web.okjike.com/recommend");
}

export function gotoPageCollection() {
    tabAction.changeCurrentTabUrl("https://web.okjike.com/me/collection");
}

export function showNotification() {
    $('div[class*="NavBar___"]:first').click();
}

function mightBeChinese(text) {
    // 移除所有空白字符
    const cleanedText = text.replace(/\s+/g, '');
    // 取处理后文本的前五个字符
    const sample = cleanedText.slice(0, 5);
    // 使用正则表达式检查是否含有中文字符
    return /[\u4e00-\u9fa5]/.test(sample);
}

export function gotoProductLaunchEvent() {
    tabAction.changeCurrentTabUrl("https://h5.ruguoapp.com/jk-product-launch-event/today");
}

// 创建一个 LRU 缓存实例
const options = {
    max: 500, // 缓存项最大数量
    maxAge: 1000 * 60 * 60 // 缓存有效期限，例如1小时
};
const translationCache = new LRUCache<string, string>(options);

export function translateText(text, targetLanguage = "zh-Hans") {
    if (mightBeChinese(text)) {
        return text;
    }
    // 检查缓存
    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache.has(cacheKey)) {
        return Promise.resolve(translationCache.get(cacheKey));
    }
    const url = 'https://bing-translation-api.vercel.app/api/translate';
    const data = { text, to: targetLanguage };
    return $.ajax({
        type: 'POST',
        url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
    }).then((response) => {
        const translatedText = response.translatedText;
        // 存储到缓存
        translationCache.set(cacheKey, translatedText);
        return translatedText;
    });
}

/**
 * 获取博客详情页里面的文案内容
 * @param 
 * @returns 
 */
export function getTruncateContent(el = $('body')) {
    const contentEle = el.find("[class*='content_truncate']");
    return contentEle;
}

// Function to change the content of the found elements to '123'
export function TranslateToCn(el) {
    el.each(function () {
        const originalText = $(this).text();
        translateText(originalText).then(translatedText => {
            $(this).text(translatedText);
        });
    });
}


/**
 *  获取当前用户的即刻用户名
 * @label dom
 * @returns {string} 当前用户的即刻用户名
 */
export function getCurrentJikeUserName() {
    return $('[class*="ScreenNameText"]').text();
}

/**
 * 
 * @returns {
 * screenName: string,
 * username: string,
 * }
 */

export async function getCurrentUserProfile() {
    // alert(`当前用户是：${name}`);
    const result = await postTask('(function() { return window.__NEXT_DATA__.props.pageProps.apolloState.data["$ROOT_QUERY.profile"]; })()',) as any;
    // filter
    const screenName = result.screenName;
    const username = result.username;
    return {
        screenName,
        username,
    };
}

export const getCurrentUserName = async () => {
    const result = await getCurrentUserProfile();
    return result.screenName;
};

export const getCurrentUserId = async () => {
    const result = await getCurrentUserProfile();
    return result.username;
};

/**
 *  获取即刻的token
 * @returns {
 * x-jike-access-token: string,
 * x-jike-refresh-token: string,
 * }
 */
export async function getJikeToken() {
    const result = await cookieActions.getAllCookiesByDomain('.okjike.com');
    // 过滤出 包含token 的cookie
    const filteredCookies = result.filter(cookie => cookie.name.includes('token'));
    // 转为Map
    const tokenMap = new Map();
    filteredCookies.forEach(cookie => {
        tokenMap.set(cookie.name, cookie.value);
    });
    return tokenMap;

}


/**
 * 判断当前URL是否为帖子详情页
 * 支持的URL格式包括:
 * - https://web.okjike.com/originalPost/{postId}
 * - https://web.okjike.com/repost/{postId}
 * @label postDetailPage
 * @returns {boolean} 如果是帖子详情页返回true，否则返回false
 */
export function isPostDetailPage() {
    const url = window.location.href;
    const postDetailRegex = /https:\/\/web\.okjike\.com\/(originalPost|repost)\/[0-9a-fA-F]+$/;
    return postDetailRegex.test(url);
}


export const toggleTranslateToCnMode = async () => {
    let rawContentEle;
    $(document).ready(function () {
        // 绑定 hover 事件到所有元素
        $('.border-tint-border').hover(function () {
            // 鼠标移入，获取当前元素
            const hoveredElement = $(this);
            const contentEle = hoveredElement.find("[class*='content_truncate']");
            rawContentEle = contentEle.html();
            TranslateToCn(contentEle);
        }, function () {
            const hoveredElement = $(this);
            //find the content element, and change it back to the original content
            const contentEle = hoveredElement.find("[class*='content_truncate']");
            contentEle.html(rawContentEle);
        });
    });
};

/**
 * 获取当前帖子详情页的id和类型
 * 支持 originalPost 和 repost
 * @label postDetailPage
 * @returns {postId: string | null, postType: "originalPost" | "repost" } 如果在帖子详情页则返回帖子id和类型，否则返回null
 */
export function getCurrentPostMeta() {
    const url = window.location.href;
    if (!isPostDetailPage()) {
        toast('请在帖子详情页使用此功能');
        return { id: null, type: null };
    }
    const urlParts = url.split('/');
    const postId = urlParts.pop();
    const postType = urlParts[urlParts.length - 1] as "originalPost" | "repost";
    return { postId, postType };
}


export async function testHandle() {
    if (!isPostDetailPage()) {
        toast("只能在帖子详情页使用");
        return;
    }


    const { postId, postType } = getCurrentPostMeta();
    toast("好咧，我要开动咯");

    const data = await getPostDetails({ postId, postType });
    const text = data.content;
    console.log('data', text);

    // const tabId = await tabAction.createTabInactive("https://v.flomoapp.com/mine?tag=Jike");
    const newPage = await buildCrossTab("https://v.flomoapp.com/mine?tag=Jike");
    const result = await newPage.actions().saveTextToFlomo(text);
    console.log('result', result);
    await newPage.close();
    // getPostDetails()
    toast("博客已存到 emo", {
        action: {
            label: '去看看',
            onClick: () => {
                tabAction.createTabAndCheckIn("https://v.flomoapp.com/mine?tag=Jike");
            }
        },
    });
}