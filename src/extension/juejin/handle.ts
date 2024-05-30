// import TabManager from "~lib/atoms/browser-tab-manager";
import toast from '~component/cmdk/toast';
import { buildCrossTab } from '~lib/function-manager';

// const tabAction = TabManager.action;

function isLogin() {
  return document.querySelectorAll('button[class^=login-button]').length > 0;
}

function isSigned() {
  return document.querySelectorAll('span[class*=signed-text]').length > 0;
}
export async function handleJuejinSign() {
  if (isLogin()) {
    toast('请先登陆！');
    return;
  }
  if (isSigned()) {
    toast('今天已经签到过了,明天再来！');
    return;
  }
  const signUrl = 'https://juejin.cn/user/center/signin?from=main_page';
  const newPage = await buildCrossTab(signUrl);
  toast('好嘞,现在就去签到。');

  const { result } = await newPage.actions().execSignIn();
  console.log('result', result);
  // 延迟等待签到接口请求
	setTimeout(async () => {
		await newPage.close();
		toast(result ? '签到成功。' : '今天已经签到过了,明天再来！');
	}, 2 * 1000);
}

interface JueJinTheme {
  theme: string;
  isFollowSystem: boolean;
}
export async function switchThemeByJuejin() {
  const themeInfo = window.localStorage.getItem('juejin_2608_theme') || '{}';
  let update: JueJinTheme = { theme: 'dark', isFollowSystem: false };
  try {
    const info = JSON.parse(themeInfo) as JueJinTheme;
    console.log('info--', info);
    info.theme = info.theme === 'dark' ? 'light' : 'dark';
    update = { ...update, ...info };
  } catch (error) {
    console.error(error);
  }
  window.localStorage.setItem('juejin_2608_theme', JSON.stringify(update));
  document.body.setAttribute('data-theme', update.theme);
}
