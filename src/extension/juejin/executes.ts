import { ExecuteHandle } from "~lib/dom-exec";

export async function execSignIn() {
	await new ExecuteHandle()
	.waitPipe(async (ctx) => {
		// console.log('12312', 12312);
		const templateBtn = await ctx.getDomByQuery('button[class^=signin]', '', 300, 20);
		console.log('templateBtn', templateBtn);
		templateBtn && templateBtn.click();
	})
	.runWait();

	return true;
}