// import TabManager from "~lib/atoms/browser-tab-manager";
import toast from '~component/cmdk/toast';
import { buildCrossTab } from '~lib/function-manager';

// const tabAction = TabManager.action;

function isLogin() {
  return document.querySelectorAll('a[href="/signup"]').length > 0;
}

export async function handleVexSign() {
  if (isLogin()) {
    toast('请先登陆！');
    return;
  }
  const signUrl = 'https://www.v2ex.com/mission/daily';
  const newPage = await buildCrossTab(signUrl);
  toast('好嘞,现在就去签到。');

  const { result } = await newPage.actions().execV2exSignIn();
  console.log('result', result);
  // 延迟等待签到接口请求
  setTimeout(async () => {
    await newPage.close();
    toast(result ? '签到成功。' : '签到异常');
  }, 2 * 1000);
}
