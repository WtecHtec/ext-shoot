// https://chatgpt.com/g/g-zx99j77kf-1-jike-ji-ke-wen-an-run-se

export const pageUrl = () => window.location.href;

export function isGTPsPage(url) {
  const regex = /^https:\/\/chatgpt\.com\/g\/[a-zA-Z0-9-]+/;
  return regex.test(url);
}
