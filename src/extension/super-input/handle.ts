import $ from 'jquery';
import toast from '~component/cmdk/toast';
import { newJob } from '~lib/dom-exec-engine/exec-engine';
import BingApi from '~lib/atoms/api-bing-transalte';
import WebInteraction from '~lib/atoms/web-common-Interaction';


const webAction = WebInteraction.action;
function findCurrentFocusInput() {
	const xpath = window.sessionStorage.getItem('active_input_xpath') || '';
	if (!xpath) return null;
	const result = document.evaluate(xpath, document).iterateNext();
	if (!result) return null;
	const focusEl = $(result);
	if (focusEl.is('input') || focusEl.is('textarea')) {
		return  focusEl as JQuery<HTMLElement>;
	}
}
export async function translateInputWords() {
	const job = newJob()
		.next(async (ctx) => {
			const inputDom = await ctx.finder.withFunc(findCurrentFocusInput);
			if (!inputDom) {
				throw new Error('当前没有 input\textarea 元素具有焦点');
			}
			const keyWords = await inputDom.element.val();
			// toast.success('搜索关键词:', {
			//   description: keyWords
			// });
			ctx.keywords = keyWords;
			ctx.textarea = inputDom;
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
			toast.success('翻译成英文啦');
		})
		.finish();

	await job.do();
}	