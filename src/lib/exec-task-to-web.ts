import { nanoid } from 'nanoid';

import ScriptInjector from './script-Injector';

export const enum MessageFrom {
  Content,
  Web
}

export type TaskId = string;

export type MessageData =
  | {
      from: MessageFrom.Content;
      payload?: {
        task?: {
          id: TaskId;
          expression: string;
        };
      };
    }
  | {
      from: MessageFrom.Web;
      payload?: {
        status?: 'ready';
        task?: {
          id: TaskId;
          result: unknown;
        };
      };
    };

const execInjector = ScriptInjector.getInstance(chrome.runtime.getURL('exec.js'));

export async function postTask(expression: string): Promise<unknown> {
  const taskId = nanoid();
  await new Promise<void>((resolve, reject) => {
    execInjector.inject({
      async: true,
      onLoad: () => {
        // console.log('Script loaded successfully!');
        resolve();
      },
      onError: (error) => {
        console.error('Error loading script:', error.message);
        reject(error);
      }
    });
  });

  // Create an event handler that we can use to listen for the response
  const handleResponse = (event: MessageEvent<MessageData>) => {
    if (event.data.from === MessageFrom.Web && event.data.payload?.task?.id === taskId) {
      window.removeEventListener('message', handleResponse);
      return event.data.payload.task.result;
    }
  };

  // Add event listener and post the message
  window.addEventListener('message', handleResponse);
  window.postMessage(
    {
      from: MessageFrom.Content,
      payload: { task: { id: taskId, expression } }
    },
    '*'
  );

  // Return a new promise that resolves when the event handler processes the response
  return new Promise((resolve, reject) => {
    // Adding a timeout could handle cases where no response is received
    const timeoutId = setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      reject(new Error('Timeout waiting for task response'));
    }, 10000); // Timeout after 10 seconds for example

    // Modify handleResponse to resolve/reject the promise
    window.addEventListener('message', (event) => {
      if (event.data.from === MessageFrom.Web && event.data.payload?.task?.id === taskId) {
        clearTimeout(timeoutId);
        resolve(event.data.payload.task.result);
        window.removeEventListener('message', handleResponse);
      }
    });
  });
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const execFuction = async (fn: Function, ...args: any[]) => {
  const expression = `(${fn.toString()})(${args.map((arg) => JSON.stringify(arg)).join(',')})`;
  return postTask(expression);
};

export const execFuncString = async (fnString: string, ...args: any[]) => {
  const expression = `(${fnString})(${args.map((arg) => JSON.stringify(arg)).join(',')})`;
  return postTask(expression);
};

export const execExpression = postTask;
