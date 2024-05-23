import toast from "~component/cmdk/toast";
import { getCurrentPostMeta, isPostDetailPage } from "./handle";
import { getPostDetails } from "./api";
import { buildCrossTab } from "~lib/function-manager";

import TabManager from "~lib/atoms/browser-tab-manager";

/**
 * 保存博客内容到Flomo
 * @label dom 
 * @returns {string} 复制的文本内容
 */
const tabAction = TabManager.action;

export async function saveContentToFlomo() {
    if (!isPostDetailPage()) {
        toast("只能在帖子详情页使用");
        return;
    }

    const blogUrl = window.location.href;

    const { postId, postType } = getCurrentPostMeta();
    toast("好咧，我要开动咯!");

    const data = await getPostDetails({ postId, postType });
    let text = data.content;
    console.log('data', text);

    // add blogUrl to text
    text += `\n${blogUrl}`;

    // const tabId = await tabAction.createTabInactive("https://v.flomoapp.com/mine?tag=Jike");
    const newPage = await buildCrossTab("https://v.flomoapp.com/mine?tag=Jike");
    const result = await newPage.actions().saveTextToFlomo(text);
    console.log('result', result);
    await newPage.close();
    // getPostDetails()
    toast("博客已保存到Flomo", {
        action: {
            label: '去看看',
            onClick: () => {
                tabAction.createTabAndCheckIn("https://v.flomoapp.com/mine?tag=Jike");
            }
        },
    });
}


