// import TabManager from "~lib/atoms/browser-tab-manager";
import toast from '~component/cmdk/toast';
import { buildCrossTab } from '~lib/function-manager';


// const tabAction = TabManager.action;

export async function handleJuejinSign() {
	const signUrl = 'https://juejin.cn/user/center/signin?from=main_page';
	const newPage = await buildCrossTab(signUrl);
	toast('好嘞,现在就去签到。');
	await newPage.actions().execSignIn();
	await newPage.close();
	
	toast('签到成功。');
}

interface JueJinTheme {
	theme: string
	isFollowSystem: boolean
}
export async function switchThemeByJuejin() {
	const themeInfo = window.localStorage.getItem('juejin_2608_theme') || '{}';
	let update: JueJinTheme = {"theme":"dark","isFollowSystem":false};
	try {
		const info =	JSON.parse(themeInfo) as JueJinTheme;
		console.log('info--', info);
		info.theme = info.theme === 'dark' ? 'light' : 'dark';
		update = { ...update, ...info };
	} catch (error) {
		console.error(error);
	}
	window.localStorage.setItem('juejin_2608_theme', JSON.stringify(update));
	document.body.setAttribute('data-theme', update.theme);
}

