import TabManager from '~lib/atoms/browser-tab-manager';

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
      sendResponse({ success: false, error: `Function ${functionName} is not registered.` });
    }
  }
}

// 实例化 FunctionManager 并注册需要的函数
export const functionManager = new FunctionManager();

const tabAction = TabManager.action;

class CrossTabProxy {
  private tabId: number;

  constructor(tabId: number) {
    this.tabId = tabId;
  }

  // 添加一个actions方法返回一个新的Proxy，用于实现特定的操作
  actions() {
    return new Proxy(
      {},
      {
        get: (_, prop) => {
          if (typeof prop !== 'string') return undefined;

          // if (['then', 'catch', 'finally'].includes(prop)) {
          //     // 处理Promise特有的方法
          //     return undefined; // 这会让Promise认为这不是一个thenable对象
          // }

          // 返回一个函数，这个函数会调用invokeFunctionInTab来在特定标签页执行对应的方法
          return async (...args: any[]) => {
            console.log(`Calling ${prop} on tab ${this.tabId} with args:`, args);
            return tabAction.invokeFunctionInTab(this.tabId, prop, args);
          };
        }
      }
    );
  }

  actionsFilter(filter) {
    return new Proxy(
      {},
      {
        get: (_, prop) => {
          if (typeof prop !== 'string') return undefined;

          // 返回一个函数，这个函数会调用invokeFunctionInTab来在特定标签页执行对应的方法
          return async (...args: any[]) => {
            console.log(`Calling ${prop} on tab ${this.tabId} with args:`, args, filter);
            return tabAction.invokeFunctionInTabFilter(this.tabId, prop, filter, args);
          };
        }
      }
    );
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
