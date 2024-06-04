import toast from '~component/cmdk/toast';
import { execFuncString } from '~lib/exec-task-to-web';
import ScriptInjector from '~lib/script-Injector';

export async function safeInjectJQuery(showToast = true) {
  const execInjector = ScriptInjector.getInstance(chrome.runtime.getURL('jquery.js'));
  await new Promise<void>((resolve, reject) => {
    execInjector.inject({
      async: true,
      onLoad: () => {
        if (showToast) {
          toast('JQuery loaded successfully!');
        }
        resolve();
      },
      onError: (error) => {
        if (showToast) {
          toast.error('Error loading JQuery ~');
        }
        reject(error);
      }
    });
  });
}

export async function testIt() {
  await safeInjectJQuery();
}

// function getTextContent() {
//   const text = $('.content_truncate__tFX8J').text();
//   return text;
// }

export async function executeClipboardScript() {
  await safeInjectJQuery(false);
  const script = await navigator.clipboard.readText();
  // console.log('script', script);
  // const fakeScript = getTextContent.toString();
  toast.message('Executing Script:', {
    description: script
  });

  try {
    const re = await execFuncString(script);
    console.table(re);
    toast.success('Script Result:', {
      description: JSON.stringify(re)
    });
  } catch (error) {
    toast.error('Script Error:', {
      description: error.message
    });
  }
}
