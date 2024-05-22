

const executeExportFeishu = (datas, feishuTableTabId, matchs) => {
	
// eslint-disable-next-line @typescript-eslint/no-unused-vars
	class ExecuteHandle {
		private waitevents: any[];
		constructor() {
			this.waitevents = [];
		}
		async getDomByXPath(xpath, delay = 2 * 1000, max = 10) {
			return new Promise((resolve, reject) => {
				const getDom = (current) => {
					const xnd = document.evaluate(xpath, document);
					const dom = xnd.iterateNext();
					if (dom) {
						resolve(dom);
						return;
					} else {
						if (max < current) {
							reject('not find dom');
						}
						setTimeout(() => {
							getDom(current + 1);
						}, delay);
					}
			};
				getDom(0);
			});
		}

		async getDomByQuery(select, content, delay = 2 * 1000, max = 10) {
			return new Promise((resolve, reject) => {
				const getDom = (current) => {
					const xnds = document.querySelectorAll(select);
					let dom = null;
					if (xnds && xnds.length > 0) {
						content && xnds.forEach((xnd) => {
							if (xnd.textContent === content) {
								resolve(xnd);
								return;
							}
						});
						dom = xnds[0];
					}
					if (dom) {
						resolve(dom);
						return;
					} else {
						if (max < current) {
							reject('not find dom');
						}
						setTimeout(() => {
							getDom(current + 1);
						}, delay);
					}
			};
				getDom(0);
			});
		}
		waitPipe(fn, delay = 2 * 1000, ...args) {
			this.waitevents.push({
				fn,
				delay,
				args: [...args],
			});
			return this;
		}
		runWaitTime(event, step, resolve, reject, arg) {
			if (!event) {
				typeof resolve === 'function' && resolve(arg);
				return;
			}
			const { fn, delay, args } = event;
			setTimeout(async () => {
				try {
					const arg = await fn(this, args);
					const nextEvent = this.waitevents.shift();
					if (arg && nextEvent) {
						nextEvent.args = [...nextEvent.args, arg];
					}
					this.runWaitTime(nextEvent, step + 1, resolve, reject, arg);
				} catch (err) {
					typeof reject === 'function' && reject(step, err);
					return;
				}
			}, delay);
		}
		runWait(resolve, reject) {
			const event = this.waitevents.shift();
			this.runWaitTime(event, 0, resolve, reject, '');
		}
	}

new ExecuteHandle()
	.waitPipe( async (ctx) => {
		// step 1: 点击插件
		const copyBtn = await ctx.getDomByQuery('.pc-tools button', '插件');
		copyBtn && copyBtn.click();
	})
	.waitPipe(async (ctx) => {
		// step 2: 点击自定义插件
		const copyBtn = await ctx.getDomByQuery('span[class="btn-myextention"]', '自定义插件');
		copyBtn && copyBtn.click();
	})
	.waitPipe(async (ctx) => {
		// step 3: 点击获取授权码
		const copyBtn = await ctx.getDomByQuery('span[class="extension-market-link-btn-v4"]', '获取授权码');
		copyBtn && copyBtn.click();
	})
	.waitPipe(async (ctx) => {
		// step 4: 点击 启用 
		const copyBtn = await ctx.getDomByQuery('span[class="ud__checkbox__label-content"]', '启用授权码');
		copyBtn && copyBtn.click();
	})
	.waitPipe(async (ctx) => {
		// step 5: 拿到授权码
		const copyBtn = await ctx.getDomByQuery('div[class="open-extension-container__personal-token__content-token-input"]');
		return copyBtn.innerHTML;
	})
	.waitPipe(async (ctx, args) => {
		// step 6: 发起请求，关闭授权码弹窗

		window.fetch('https://jike.zeabur.app/jike_insert', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tableData: datas,
				config: {
					APP_TOKEN: matchs[2],
					TABLEID: matchs[3],
					PERSONAL_BASE_TOKEN: args[0],
				}
			}),
		});
		const copyBtn = await ctx.getDomByQuery('div[data-focus-lock-disabled="false"] .ud__modal__footer__btns button', '确定');
		copyBtn && copyBtn.click();
	})
	.runWait(() => {
		console.log('成功');
	}, (...args) => {
		console.log('失败', ...args);
	});
};
export default executeExportFeishu;