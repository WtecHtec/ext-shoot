// atom-common.ts
export const createModuleProxy = (moduleName, methods) => {
    const handler = {
        get(target, propKey) {
            return function (...args) {
                return new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage({
                        moduleName: moduleName,
                        methodName: propKey,
                        args: args
                    }, response => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            console.log(`Method response ${propKey}:`, response.result);  // Debug: 输出方法返回值
                            resolve(response.result);
                        }
                    });
                });
            };
        }
    };
    return new Proxy(methods, handler);
};

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
                    .then(result => sendResponse({ result }))
                    .catch(error => {
                        console.error('Error executing method', { error, moduleName, methodName });
                        sendResponse({ error: error.message });
                    });
            } catch (error) {
                console.error('Error handling message', { error });
                sendResponse({ error: 'Error during method execution' });
            }
            return true;  // Keep the message channel open for async response
        });
    }
}

