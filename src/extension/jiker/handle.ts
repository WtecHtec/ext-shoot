// Function to find and return elements with a class that includes 'content_truncate'
import $ from 'jquery';
import { LRUCache } from 'lru-cache';
import TabManager from "~lib/atoms/browser-tab-manager";
import { postTask } from '~lib/exec-task-to-web';

// Function to perform translation

// support lang
// https://github.com/plainheart/bing-translate-api/blob/HEAD/src/config.json#L9-L30

const tabAction = TabManager.action;

export function checkPostCreatePage() {
    tabAction.changeCurrentTabUrl("https://web.okjike.com");
}

export function checkCurrentHomePage() {
    tabAction.changeCurrentTabUrl("https://web.okjike.com/me");
}


function mightBeChinese(text) {
    // 移除所有空白字符
    const cleanedText = text.replace(/\s+/g, '');
    // 取处理后文本的前五个字符
    const sample = cleanedText.slice(0, 5);
    // 使用正则表达式检查是否含有中文字符
    return /[\u4e00-\u9fa5]/.test(sample);
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


// 获取页面中class为NavBar__ScreenNameText的元素中的文本。
// 把这个函数命名为这个获取当前jike用户的用户名
export function getCurrentJikeUserName() {
    const name = (window as any).__NEXT_DATA__.props?.pageProps?.apolloState.data["$ROOT_QUERY.profile"].screenName;
    if (!name) {
        return $('[class*="ScreenNameText"]').text();
    }
    return name;
}
export async function getJikeUserName() {
    const name = getCurrentJikeUserName();
    // alert(`当前用户是：${name}`);
    const result = await postTask('(function() { return window.__NEXT_DATA__.props.pageProps.apolloState.data["$ROOT_QUERY.profile"]; })()',
    );
    console.log('result', result);
    // postTask(`console.log(window.__NEXT_DATA__.props.pageProps.apolloState.data["$ROOT_QUERY.profile"].screenName)`);
    return name;
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

export function exitTranslateToCnMode() {
    $(document).ready(function () {
        $('.border-tint-border').off('mouseenter mouseleave');
    });
}