/* eslint-disable @typescript-eslint/ban-types */
import $ from 'jquery';

interface WaitEvent {
    fn: Function;
    delay: number;
    args: any[];
}

export class ExecuteHandle {
    private waitevents: WaitEvent[];

    constructor() {
        this.waitevents = [];
    }

    async getDomByXPath(xpath: string, delay: number = 300, maxAttempts: number = 10): Promise<JQuery<HTMLElement> | null> {
        return this.findDom(
            () => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement | null;
                return element ? $(element) : null;
            },
            delay,
            maxAttempts
        );
    }

    async getDomByQuery(selector: string, content?: string, delay: number = 500, maxAttempts: number = 20): Promise<JQuery<HTMLElement> | null> {
        return this.findDom(
            () => {
                const elements = $(selector);
                if (content) {
                    const matchedElement = elements.filter((_, el) => $(el).text() === content);
                    return matchedElement.length > 0 ? matchedElement : null;
                }
                return elements.length > 0 ? elements : null;
            },
            delay,
            maxAttempts
        );
    }

    public findDom(findFn: () => JQuery<HTMLElement> | null, delay: number, maxAttempts: number): Promise<JQuery<HTMLElement> | null> {
        return new Promise((resolve, reject) => {
            const attempt = (currentAttempt: number) => {
                const element = findFn();
                if (element) {
                    resolve(element);
                } else if (currentAttempt < maxAttempts) {
                    setTimeout(() => attempt(currentAttempt + 1), delay);
                } else {
                    reject(new Error('DOM element not found'));
                }
            };
            attempt(0);
        });
    }

    waitPipe(fn: (ctx: ExecuteHandle, ...args: any[]) => Promise<void>, delay: number = 300, ...args: any[]): this {
        const callback = (...args: any[]) => fn(this, ...args);  // 创建一个新的函数，传递 this
        this.waitevents.push({ fn: callback, delay, args });
        return this;
    }

    private runWaitTime(event: WaitEvent | undefined, resolve: (value?: any) => void, reject: (reason?: any) => void): void {
        if (!event) {
            console.log("所有事件执行完毕");
            resolve(null);
            return;
        }
        const { fn, delay, args } = event;
        console.log("即将执行事件:", { fn, delay, args });
        setTimeout(async () => {
            try {
                const result = await fn(...args);
                console.log("事件执行成功，结果为:", result);
                const nextEvent = this.waitevents.shift();
                if (nextEvent) {
                    nextEvent.args.push(result);
                }
                console.log("准备执行下一个事件, 剩余事件数量:", this.waitevents.length);
                this.runWaitTime(nextEvent, resolve, reject);
            } catch (err) {
                console.error("事件执行失败，错误信息:", err);
                reject(err);
            }
        }, delay);
    }

    runWait(): Promise<any> {
        return new Promise((resolve, reject) => {
            const firstEvent = this.waitevents.shift();
            this.runWaitTime(firstEvent, resolve, reject);
        });
    }
}

export async function useFeishuTemplate(): Promise<boolean> {
    // 使用模板
    await new ExecuteHandle()
        .waitPipe(async function () {
            console.log('12312', 12312);
            const templateBtn = await this.getDomByQuery('.preview-footer__use-btn');
            templateBtn && templateBtn.click();
            console.log('templateBtn', templateBtn);
        })
        .runWait();

    return true;
}

export async function executeUseageTemp(): Promise<boolean> {
    // const isLogin = await isLoggedInFeishu();
    // if (!isLogin) {
    //     return false;
    // }
    await useFeishuTemplate();
    return true;
}
