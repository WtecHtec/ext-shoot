import toast from "~component/cmdk/toast";
import { getEditedPostContent } from "./change-post";

/**
 * 复制博客内容到剪贴板
 * @label dom
 * @returns {string} 复制的文本内容
 */
export function copyContentToClipboard() {
    const content = getEditedPostContent();
    navigator.clipboard.writeText(content);
    toast('复制到剪贴板啦!');
    return content;
}


