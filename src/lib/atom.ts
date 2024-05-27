// atom-common.ts
type Methods = {
  [key: string]: (...args: any[]) => any;
};

export function createModuleProxy<T extends Methods>(
  moduleName: string,
  methods: T
): { [K in keyof T]: (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>> } {
  const handler: ProxyHandler<T> = {
    get(target, propKey, receiver) {
      const originalMethod = target[propKey as keyof T];
      if (typeof originalMethod === 'function') {
        return function (...args: any[]) {
          return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
              {
                moduleName: moduleName,
                methodName: propKey,
                args: args
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  console.log(`Method response ${String(propKey)}:`, response.result);
                  resolve(response.result);
                }
              }
            );
          });
        };
      }
      return Reflect.get(target, propKey, receiver);
    }
  };
  return new Proxy(methods, handler);
}

// atom.ts

export class Atom {
  private modules: { [key: string]: any } = {};

  load(module: any): void {
    this.modules[module.name] = module.methods;
  }

  listen(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const { moduleName, methodName, args } = message;
      console.log(`Received message for module: ${moduleName} method: ${methodName}`);
      const module = this.modules[moduleName];

      if (!module || typeof module[methodName] !== 'function') {
        console.error('Method not found or not a function', { moduleName, methodName });
        // sendResponse({ error: 'Method not found or not a function' });
        return true;
      }

      try {
        module[methodName](...args)
          .then((result) => sendResponse({ result }))
          .catch((error) => {
            console.error('Error executing method', { error, moduleName, methodName });
            sendResponse({ error: error.message });
          });
      } catch (error) {
        console.error('Error handling message', { error });
        sendResponse({ error: 'Error during method execution' });
      }
      return true; // Keep the message channel open for async response
    });
  }
}
