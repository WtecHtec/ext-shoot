import { error } from 'console';

import { ExecuteHandle } from '~lib/dom-exec';

export async function execV2exSignIn() {
  try {
    await new ExecuteHandle()
      .waitPipe(async (ctx) => {
        // 查看是否已经签到过
        try {
          const templateBtn = await ctx.getDomByQuery('a[href="/signup"]', '', 300, 5);
          if (templateBtn && templateBtn.length) {
            throw error('没有登陆');
          }
        } catch (e) {
          console.log('没有找到---', e);
        }
      })
      .waitPipe(async (ctx) => {
        // console.log('12312', 12312);
        const templateBtn = await ctx.getDomByQuery('input[onclick*="/mission/daily/redeem"]', '', 300, 20);
        console.log('templateBtn', templateBtn);
        templateBtn && templateBtn.click();
      })
      .runWait();
  } catch (err) {
    return false;
  }
  return true;
}
