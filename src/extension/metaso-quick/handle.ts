import toast from '~component/cmdk/toast';
import { AtomDomMetaso } from '~lib/atoms/dom-metaso';
import AtomWebInteraction from '~lib/atoms/web-common-Interaction';
import { newJob } from '~lib/dom-exec-engine/exec-engine';

export const testIt = async () => {
  toast('Test it');
};

export const searchClipboardText = async () => {
  await newJob()
    .next(async (ctx) => {
      const clipboardData = await navigator.clipboard.readText();
      if (!clipboardData) {
        toast('剪贴板内容为空');
        return;
      }
      ctx.clipboardData = clipboardData;
    })
    .next(async (ctx) => {
      toast(ctx.clipboardData);
      searchKeyword(ctx.clipboardData);
    })
    .do();
};

export const searchKeyword = async (keyword: string) => {
  await newJob()
    .next(async (ctx) => {
      ctx.keyword = keyword;
    })
    .next(async (ctx) => {
      const textarea = await ctx.finder.withFunc(AtomDomMetaso.finder.selectTextArea);
      textarea.element.focus();
      AtomWebInteraction.action.triggerFromElement.typeText(textarea.toDom() as any, {
        value: ctx.keyword,
        clearValue: true
      });
    })
    .do();
};
