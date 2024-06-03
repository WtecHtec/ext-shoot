// import TabManager from "~lib/atoms/browser-tab-manager";
import toast from '~component/cmdk/toast';
import { execFuncString } from '~lib/exec-task-to-web';
import ScriptInjector from '~lib/script-Injector';

// const tabAction = TabManager.action;

export async function safeInjectJQuery() {
  const execInjector = ScriptInjector.getInstance(chrome.runtime.getURL('jquery.js'));
  // Ensure the script is loaded before posting the task
  await new Promise<void>((resolve, reject) => {
    execInjector.inject({
      async: true,
      onLoad: () => {
        toast('JQuery loaded successfully!');
        resolve();
      },
      onError: (error) => {
        toast.error('Error loading JQuery ~');
        reject(error);
      }
    });
  });
}

export function toggleEyeComfortMode() {
  const isDarkMode = document.body.classList.contains('dark-mode');

  if (isDarkMode) {
    // 切换回亮色模式
    document.body.classList.remove('dark-mode');
    document.body.style.filter = '';
    const styleElements = document.head.querySelectorAll('.dark-mode-style');
    styleElements.forEach((elem) => document.head.removeChild(elem));
  } else {
    // 切换到暗黑模式
    document.body.classList.add('dark-mode');
    document.body.style.filter = 'invert(1) hue-rotate(180deg)';
    const newStyleElement = document.createElement('style');
    newStyleElement.classList.add('dark-mode-style');
    newStyleElement.type = 'text/css';
    newStyleElement.innerHTML = `
      html {
        background-color: #333 !important;
      }
      body img, body video {
        filter: invert(1) hue-rotate(180deg) !important;
      }
    `;
    document.head.appendChild(newStyleElement);
  }
}

export async function testIt() {
  await safeInjectJQuery();
}

function getTextContent() {
  const text = $('.content_truncate__tFX8J').text();
  return text;
}

export async function executeClipboardScript() {
  // 获取剪贴板中的脚本
  await safeInjectJQuery();
  const script = await navigator.clipboard.readText();
  console.log('script', script);
  const fakeScript = getTextContent.toString();
  // 执行脚本
  // console.log('fakeScript', fakeScript);
  const re = await execFuncString(fakeScript);
  console.log('re', re);
  // executeScript(script);
}
