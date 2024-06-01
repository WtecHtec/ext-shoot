import $ from 'jquery';

import toast from '~component/cmdk/toast';

import { deletePostById, repostWithNewContent } from './api';
import { getCurrentJikeUserName, getCurrentPostMeta, getTruncateContent, isPostDetailPage } from './handle';

/**
 * 重新创建并发布一个帖子，然后导航到新帖子的URL。
 */
export async function reCreateAndNavigatePost() {
  // 获取当前帖子的详细信息
  const { postId, postType } = await getCurrentPostMeta();

  // 创建一个含有新内容的新帖子
  const newId = await repostWithNewContent({
    originalPostId: postId,
    newContent: getEditedPostContent(),
    postType: postType
  });

  // 若创建成功，则打印新帖子ID
  if (newId) {
    console.log('新帖子的ID:', newId);
  }

  // 删除原始帖子
  await deletePostById({
    postId,
    postType: postType
  });

  // 生成新帖子的URL
  const newUrl = generatePostUrl(newId, postType);

  // 用新URL替换当前窗口的位置
  replaceCurrentWindowLocation(newUrl);
}

/**
 * replce current window location with new url
 * @param {string} newUrl
 * @label postDetailPage dom
 */
export function replaceCurrentWindowLocation(newUrl) {
  window.location.replace(newUrl);
}

/**
 * 添加一个“重新发布”按钮到界面上。
 * @label postDetailPage dom
 */

export function addRepostButton() {
  const originalButton = $('button').filter(function () {
    return $(this).text() === '发布';
  });
  if (originalButton.length > 0) {
    const newButton = originalButton
      .clone()
      .text('重新发布')
      .css('width', '90px')
      .removeAttr('disabled')
      .click(function () {
        reCreateAndNavigatePost();
      });
    $('.text-body-1').last().append(newButton);
  } else {
    console.log('未找到发布按钮，请检查页面元素');
  }
}

/**
 * 获取当前帖子详情页的发帖人用户名
 * @returns {string | null} 如果在帖子详情页则返回用户名，否则返回null
 */
export function getPosterUsername() {
  if (!isPostDetailPage()) {
    toast('请在帖子详情页使用此功能');
    return null;
  }
  // 使用jQuery选择article元素内部第2个div中第1个div里的第一个a元素，并获取其文本内容
  const username = $('article > div:nth-child(2) > div:first-child a').first().text();
  return username;
}

export function exitTranslateToCnMode() {
  $(document).ready(function () {
    $('.border-tint-border').off('mouseenter mouseleave');
  });
}

/**
 * 判断用户是否有编辑当前帖子的权限
 * @returns {boolean} 如果用户是这个帖子的作者，返回true，否则返回false
 */
export function userHasEditPermissions() {
  const postAuthor = getPosterUsername();
  const userScreen = getCurrentJikeUserName();
  return postAuthor === userScreen;
}

/**
 * 使详情页的内容可编辑
 * @label postDetailPage dom
 *
 */
export async function makeContentEditable() {
  if (!isPostDetailPage()) {
    toast('请在帖子详情页使用此功能');
    return;
  }
  if (!userHasEditPermissions()) {
    toast('只有帖子的作者才能编辑帖子内容');
    return;
  }
  $(document).ready(function () {
    $('[class*="content_truncate"]').attr('contenteditable', 'true');
    $('[class*="content_truncate"]')
      .first()
      .replaceWith(function () {
        const attrs = {};
        $.each(this.attributes, function () {
          attrs[this.name] = this.value;
        });

        return $('<span />', attrs).append($(this).contents());
      });
  });

  toast('已开启编辑模式');
}

/**
 * 获取编辑之后的帖子内的内容
 * @label postDetailPage dom
 * @returns {string} 编辑之后的帖子文本内容
 */
export function getEditedPostContent() {
  const contentEle = getTruncateContent();
  const htmlContent = contentEle.html();
  // 修正带有<a>标签的内容，保留超链接文本
  const cleanedContent = htmlContent.replace(/<a[^>]*>([^<]+)<\/a>/gi, '$1');
  const textContent = cleanedContent.replace(/<br\s*\/?>/gi, '\n');
  return textContent;
}

export const generatePostUrl = (postId, postType) => {
  return `https://web.okjike.com/${postType}/${postId}`;
};

/**
 * 重新编辑帖子
 * @bug 带有链接的时候，编辑后的内容会丢失链接˚
 */
export async function reEditPost() {
  makeContentEditable();
  addRepostButton();
}
