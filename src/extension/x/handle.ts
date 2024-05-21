
import TabManager from "~lib/atoms/browser-tab-manager";
import $ from 'jquery';
import toast from "~component/cmdk/toast";

const tabAction = TabManager.action;

/**
 * 判断是否在twitter的详情页
 * @label dom
 */
// https://twitter.com/vercel/status/1791529671055806663
export const isTwitterDetailPage = () => {
    const urlPattern = /^https:\/\/twitter\.com\/\w+\/status\/\d+/;
    return urlPattern.test(window.location.href);
};


/**
 * 获取详情页的帖子meta信息
 * @label dom
 * @returns {userId: string, postId: string}
 */
export const getCurrentPostMeta = () => {
    const url = window.location.href;
    if (!isTwitterDetailPage()) {
        toast('请在帖子详情页使用此功能');
        return { userName: null, postId: null };
    }
    const urlParts = url.split('/');
    const postId = urlParts.pop();
    const userId = urlParts.pop();
    return { userId, postId };
};


interface TweetInfo {
    authorName: string;
    avatarImage: string;
    authorAtId: string;
    tweetContent: string;
    tweetImage?: string;
}
/**
 * 获取详情页的帖子信息
 * @label dom
 * @returns {TweetInfo}
 */

function extractTweetInfo(): TweetInfo {
    // Extract the author's name
    const authorName = $('div[data-testid="User-Name"] span span').first().text().trim() || 'Unknown';

    // Extract the avatar URL
    const avatarImage = $('div[data-testid="Tweet-User-Avatar"] img').attr('src') || '';

    // Extract the author's @ ID
    const authorAtId = $('div[data-testid="User-Name"]').find('div:contains("@")').first().text().trim() || 'Unknown';

    // Extract the tweet content
    const tweetContent = $('div[data-testid="tweetText"]').text().trim() || 'No content';

    // Extract the tweet image URL if it exists
    const tweetImage = $('div[data-testid="tweetPhoto"] img').attr('src') || undefined;

    // Return the structured tweet information
    return {
        authorName,
        avatarImage,
        authorAtId,
        tweetContent,
        tweetImage,
    };
}

/**
 * 切换子页面
 * @label dom tab
 */
export const goto = {
    home: () => {
        tabAction.changeCurrentTabUrl("https://twitter.com/home");
    },
    expore: () => {
        tabAction.changeCurrentTabUrl("https://twitter.com/explore");
    },
    bookmarks: () => {
        tabAction.changeCurrentTabUrl("https://twitter.com/i/bookmarks");
    }
};


export function readClipboard() {
    return new Promise((resolve, reject) => {
        if (!navigator.clipboard) {
            reject("该浏览器不支持 Clipboard API");
            return;
        }

        navigator.clipboard.readText().then(
            clipText => {
                resolve(clipText);
            },
            err => {
                reject("无法读取剪贴板内容：" + err);
            }
        );
    });
}


// function formatTextToHTML(text: string): string {
//     const lines: string[] = text.split('\n');
//     let html: string = '';
//     for (let i = 0; i < lines.length; i++) {
//         html += `<p>${lines[i]}</p>`;
//     }
//     return html;
// }

// function appendToContentEditable(html: string): void {
//     $('.editor-content .ProseMirror').append(html);
// }

export function replaceStateToContentEditable(html: string): void {
    $('.editor-content .ProseMirror').html(html);
}


export async function testIt() {
    const result = await extractTweetInfo();
    console.log('result', result);
}