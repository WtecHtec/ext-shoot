

const executeUseageTemp = () => {
	
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
		// step 1: 使用模板
		const copyBtn = await ctx.getDomByXPath('/html/body/div[1]/div/div[3]/div/div[2]/button');
		copyBtn && copyBtn.click();
	}, 2 * 1000)
	.runWait(() => {
		console.log('成功');
		window.close();
	}, (...args) => {
		alert('检查登陆状态或是否被拦截');
		console.log('失败', ...args);
	});
};
export default executeUseageTemp;