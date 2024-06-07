// 引入必要的工具和定义
import triggerEvent from './event';
import { keyDefinitions } from './key-definitions';
import { sleep } from './utils';

interface KeyPressData {
  keys: string[]; // 例如: ["Control+Shift+S", "Alt+F4"]
  pressTime?: number;
  bubbles?: boolean;
  cancelable?: boolean;
}

// 创建事件初始化对象
function createEventInit(keys: string[], data: KeyPressData): KeyboardEventInit {
  return {
    bubbles: data.bubbles ?? true,
    cancelable: data.cancelable ?? true,
    ctrlKey: keys.includes('Control'),
    shiftKey: keys.includes('Shift'),
    altKey: keys.includes('Alt'),
    metaKey: keys.includes('Meta'),
    key: '',
    code: '',
    keyCode: 0
  };
}

// 处理按键组合
async function processKeyCombo(element: HTMLElement, keyCombo: string, data: KeyPressData, pressTime: number) {
  const keys = keyCombo.split('+');
  const eventInit = createEventInit(keys, data);

  for (const key of keys) {
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
      continue; // 跳过修饰键的处理
    }

    const keyDetail = keyDefinitions[key];
    if (!keyDetail) {
      console.error(`Key "${key}" is not defined in keyDefinitions.`);
      continue; // 跳过未定义的按键
    }

    // 使用keyDefinitions中的定义来设置key、code、keyCode
    eventInit.key = keyDetail.key;
    eventInit.code = keyDetail.code;
    eventInit.keyCode = keyDetail.keyCode;

    triggerEvent(element, 'keydown', eventInit);
    if (pressTime > 0) await sleep(pressTime);
    triggerEvent(element, 'keyup', eventInit);
  }
}

// 模拟按键函数
export async function simulateByKeyCombo(element: HTMLElement, data: KeyPressData): Promise<void> {
  if (!element) {
    throw new Error("Element is not provided or doesn't exist.");
  }

  const pressTime = data.pressTime ?? 0;

  for (const keyCombo of data.keys) {
    await processKeyCombo(element, keyCombo, data, pressTime);
  }
}

export const keyPress = {
  simulateByKeyCombo
};
