import TabManager from '~lib/atoms/browser-tab-manager';

const tabAction = TabManager.action;
export async function checkTraffic() {
  // 获取当前网址
  const currentUrl: string = window.location.href;

  // 解析当前网址获取域名
  const parsedUrl = new URL(currentUrl);
  const domain = parsedUrl.hostname;

  // 构建 SimilarWeb 的网址
  const similarWebUrl = `https://pro.similarweb.com/#/digitalsuite/websiteanalysis/overview/website-performance/*/999/3m?webSource=Total&key=${domain}`;

  // 打开 SimilarWeb 的网址
  const tabId = await tabAction.createTabInactive(similarWebUrl);
  console.log(`Open SimilarWeb tab with tabId: ${tabId}`);

  const getTraffic = () => {
    const element = document.querySelector('.TotalNumberStyled-cUKjeK.gpczuR');
    const text = element.textContent;
    return text;
  };

  // const testScript = `document.title`;
  // await new Promise(resolve => setTimeout(resolve, 1000));

  const result = await tabAction.executeScriptInTab(tabId, getTraffic.toString());
  console.log(`${result}`);
}
