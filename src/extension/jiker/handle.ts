// Function to find and return elements with a class that includes 'content_truncate'
import $ from 'jquery';
import { LRUCache } from 'lru-cache';
// Function to perform translation

// support lang
// https://github.com/plainheart/bing-translate-api/blob/HEAD/src/config.json#L9-L30


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


