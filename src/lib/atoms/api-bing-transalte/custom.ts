import axios from 'axios';
import { LRUCache } from 'lru-cache';

export function mightBeChinese(text) {
  // 移除所有空白字符
  const cleanedText = text.replace(/\s+/g, '');
	console.log('cleanedText---', cleanedText);
  // 取处理后文本的前五个字符
  const sample = cleanedText && cleanedText.slice(0, 5);
  // 使用正则表达式检查是否含有中文字符
  return /[\u4e00-\u9fa5]/.test(sample);
}

const options = {
  max: 500, // 缓存项最大数量
  maxAge: 1000 * 60 * 60 // 缓存有效期限，例如1小时
};
const translationCache = new LRUCache<string, string>(options);

export function translateText(text, targetLanguage = 'zh-Hans') {
  // 检查缓存
  const cacheKey = `${text}_${targetLanguage}`;
  if (translationCache.has(cacheKey)) {
    return Promise.resolve(translationCache.get(cacheKey));
  }
  const url = 'https://bing-translation-api.vercel.app/api/translate';
  const data = { text, to: targetLanguage };
  return axios
    .post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      const translatedText = response.data.translatedText;
      // 存储到缓存
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    });
}

export function translateToEnglish(text) {
  if (!text) {
    return Promise.resolve('');
  }
  return translateText(text, 'en');
}
