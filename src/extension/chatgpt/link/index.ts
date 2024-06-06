// https://chatgpt.com/g/g-zx99j77kf-1-jike-ji-ke-wen-an-run-se

export const pageUrl = () => window.location.href;

export function isGTPsPage(url = pageUrl()) {
  const regex = /^https:\/\/chatgpt\.com\/g\/[a-zA-Z0-9-]+/;
  return regex.test(url);
}

export function isEditorPage(url = pageUrl()) {
  const regex = /^https:\/\/chatgpt\.com\/gpts\/editor\/[a-zA-Z0-9-]+/;
  return regex.test(url);
}

export const extractGPTsId = (url = pageUrl()) => {
  const regex = /(g-[a-zA-Z0-9]+?)(?:-|$)/;
  const result = regex.exec(url);
  return result && result[1];
};

export const buildGPTsEditorUrl = (gptsId) => `https://chatgpt.com/gpts/editor/${gptsId}`;
