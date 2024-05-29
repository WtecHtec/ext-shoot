import { error } from "console";
import { ExecuteHandle } from "~lib/dom-exec";

export async function execSignIn() {
	try {
		await new ExecuteHandle()
		.waitPipe(async (ctx)=> {
			// 查看是否已经签到过
			const templateBtn = await ctx.getDomByQuery('button[class^=signedin]', '', 300, 5);
			if (templateBtn && templateBtn.length) {
				throw error('已经签到过');
			}
		})
		.waitPipe(async (ctx) => {
			// console.log('12312', 12312);
			const templateBtn = await ctx.getDomByQuery('button[class^=signin]', '', 300, 20);
			console.log('templateBtn', templateBtn);
			templateBtn && templateBtn.click();
		})
		.runWait();
	} catch(err) {
		return false;
	}
	return true;
}