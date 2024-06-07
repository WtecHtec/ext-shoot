import toast from '~component/cmdk/toast';
import BingApi from '~lib/atoms/api-bing-transalte';
import WebInteraction from '~lib/atoms/web-common-Interaction';
import { newJob } from '~lib/dom-exec-engine/exec-engine';
import { buildCrossTabAndCheckIn } from '~lib/function-manager';

import { atom } from './atom';
import { getFirstImageFromClipboard } from './util';

const webAction = WebInteraction.action;
export const testIt = async () => {
  toast('Test it');
};

export const searchClipboardText = async () => {
  const clipboardData = await navigator.clipboard.readText();
  if (!clipboardData) {
    toast('剪贴板内容为空');
    return;
  }
  window.location.href = `https://www.google.com/search?q=${clipboardData}`;
};

export const searchClipboardImage = async () => {
  const job = newJob()
    .next(async (ctx) => {
      const imageFile = await getFirstImageFromClipboard();
      // todo: bug 剪贴板获取到的图片不全,操作系统复制的文件图片无法获取
      if (!imageFile) {
        throw new Error('剪贴板中没有图像文件');
      }
      console.log('imageFile', imageFile);
      ctx.imageFile = imageFile;
    })
    .error(async (ctx, error) => {
      toast(error.message);
    })
    .next(async (ctx) => {
      const imageBtn = await ctx.finder.withFunc(atom.superGoogle.findImageSearchBtn);
      webAction.triggerFromCursor.clickElement(imageBtn.toDom());
    })
    .next(
      async (ctx) => {
        const uploadInput = await ctx.finder.withFunc(atom.superGoogle.findImageUploadInput);
        if (!uploadInput) {
          throw new Error('没有找到上传按钮');
        }
        webAction.triggerFromElement.uploadFile(uploadInput.toDom() as HTMLInputElement, [ctx.imageFile]);
      },
      {
        retry: 6
      }
    )

    .finish();

  await job.do();
};

export const translateSearchKeywords = async () => {
  const job = newJob()
    .next(async (ctx) => {
      const searchArea = await ctx.finder.withFunc(atom.superGoogle.findSearchTextarea);
      const keyWords = await searchArea.element.val();
      // toast.success('搜索关键词:', {
      //   description: keyWords
      // });
      ctx.keywords = keyWords;
      ctx.textarea = searchArea;
    })
    .next(async (ctx) => {
      const ifChinese = BingApi.action.mightBeChinese(ctx.keywords);
      if (!ifChinese) {
        throw new Error('不是中文');
      }
    })
    .next(async (ctx) => {
      const translated = await BingApi.action.translateToEnglish(ctx.keywords);
      // toast.success('翻译结果:', {
      //   description: translated
      // });
      ctx.newKeywords = translated;
    })
    .next(async (ctx) => {
      webAction.triggerFromElement.typeText(ctx.textarea.toDom() as HTMLTextAreaElement, {
        value: ctx.newKeywords,
        clearValue: true
      });
      ctx.textarea.element.focus(); // 保证输入框获取焦点
    })
    .success(async () => {
      toast.success('关键词翻译成英文啦');
    })
    .finish();

  await job.do();
};

export const searchInMetaso = async () => {
  newJob()
    .next(async (ctx) => {
      const searchArea = await ctx.finder.withFunc(atom.superGoogle.findSearchTextarea);
      const keyWords = await searchArea.element.val();
      // toast.success('搜索关键词:', {
      //   description: keyWords
      // });
      ctx.keywords = keyWords;
    })
    .next(async (ctx) => {
      toast.success('搜索关键词:', {
        description: ctx.keywords
      });
    })
    .next(async (ctx) => {
      const metaSoPage = await buildCrossTabAndCheckIn('https://metaso.cn');
      await metaSoPage.actions().searchKeywordInMetaso(ctx.keywords);
    })
    .do();
};
