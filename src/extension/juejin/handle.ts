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


