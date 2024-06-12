import TabManager from '~lib/atoms/browser-tab-manager';
import { WaitForTabOptions } from '~lib/atoms/browser-tab-manager/tab-load';

class FunctionManager {
  private functions: { [key: string]: (...args: any[]) => Promise<any> } = {};

  constructor() {
    // 初始化时注册消息监听
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'invokeFunction') {
        this.handleInvokeFunction(message, sendResponse);
        return true; // 返回true以支持异步的sendResponse调用
      }
    });
  }

  public registerFunction(name: string, func: (...args: any[]) => Promise<any>) {
    this.functions[name] = func;
  }

  private async handleInvokeFunction(message: any, sendResponse: (response: any) => void) {
    const { functionName, args } = message;
    if (this.functions[functionName]) {
      try {
        const result = await this.functions[functionName](...args);
        sendResponse({ success: true, result });
      } catch (error) {
        console.error(`Error invoking function ${functionName}:`, error);
        sendResponse({ success: false, error: error.message });
      }
    } else {
      sendResponse({
        success: false,
        error: `Function ${functionName} is not registered.`
      });
    }
  }
}

export const functionManager = new FunctionManager();

const tabAction = TabManager.action;

class CrossTabProxy {
  public tabId: number;

  constructor(tabId: number) {
    this.tabId = tabId;
  }

  actions(): any {
    return new Proxy(
      {},
      {
        get: (_, prop) => {
          if (typeof prop !== 'string') return undefined;
          return async (...args: any[]) => {
            console.log(`Calling ${prop} on tab ${this.tabId} with args:`, args);
            return tabAction.invokeFunctionInTab(this.tabId, prop, args);
          };
        }
      }
    );
  }

  get id() {
    return this.tabId;
  }

  async waitForLoad(options: WaitForTabOptions = {}) {
    console.log('options', options);
    return await tabAction.waitForTabToLoad(this.tabId, options);
  }

  async checkIfLoaded() {
    return await tabAction.isTabLoaded(this.tabId);
  }

  async close() {
    return await tabAction.closeTab(this.tabId);
  }
}

export async function buildCrossTab(url: string): Promise<CrossTabProxy> {
  // 模拟创建新标签页并获取 tabId
  const tabId = (await tabAction.createTabInactive(url)) as number;
  return new CrossTabProxy(tabId);
}

export async function buildCrossTabAndCheckIn(url: string): Promise<CrossTabProxy> {
  // 模拟创建新标签页并获取 tabId
  const tabId = (await tabAction.createTabNextToCurrent(url)) as number;
  return new CrossTabProxy(tabId);
}
