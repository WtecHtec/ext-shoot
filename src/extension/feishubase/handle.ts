import $ from 'jquery';

import { ExecuteHandle } from '~lib/dom-exec';

import handleExportFeishu from './executes/execute.export.feishu';

/**
 * 判断是否登陆
 * @label dom
 * @returns {boolean} 如果已经登陆返回true，否则返回false
 */

export async function isLoggedInFeishu(): Promise<boolean> {
  // 判断是否登陆
  const ifLogin = !$('.note-login button').text().includes('登录');
  return ifLogin;
}

export async function useFeishuTemplate(): Promise<boolean> {
  // 使用模板
  await new ExecuteHandle()
    // .waitPipe(async (ctx) => {
    //     const copyBtn = await ctx.getDomByQuery('.template-mark-banner__content__right button');
    //     copyBtn && copyBtn.click();
    //     console.log('copyBtn', copyBtn);嗯
    // })
    .waitPipe(async (ctx) => {
      // console.log('12312', 12312);
      const templateBtn = await ctx.getDomByQuery('.preview-footer__use-btn', '', 300, 20);
      templateBtn && templateBtn.click();
      console.log('templateBtn', templateBtn);
    })
    .runWait();

  return true;
}
export async function executeUseageTemp(): Promise<boolean> {
  const isLogin = await isLoggedInFeishu();
  if (!isLogin) {
    return false;
  }
  await useFeishuTemplate();
  return true;
}

export async function executeExportFeishu(...args): Promise<boolean> {
  const isLogin = await isLoggedInFeishu();
  if (!isLogin) {
    return false;
  }
  const feishuRegex = /https:\/\/([a-zA-Z0-9]+).feishu.cn\/base\/([a-zA-Z0-9]+)\?table=([a-zA-Z0-9]+)/;
  const matchs = window.location.href?.match(feishuRegex);
  // console.log('executeExportFeishu----', args);
  await handleExportFeishu(args[0], '', matchs);
  return true;
}
