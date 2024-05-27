import { getSnapSeekData, saveSnapSeekData } from '~utils/management';
import { debounce, formatDate, getPageInfo } from '~utils/util';

async function SaveSnapSeek() {
  const info = getPageInfo();
  if (!info.title || !info.text || !info.url) return;
  const [, snapsDataObj] = await getSnapSeekData();
  const dateKey = formatDate(new Date(), 'yyyy-MM-dd');
  if (!snapsDataObj[dateKey]) {
    snapsDataObj[dateKey] = [];
  }
  const fidx = snapsDataObj[dateKey].findIndex(({ url }) => url === info.url);
  if (fidx > -1) {
    snapsDataObj[dateKey].splice(fidx, 1);
  }
  snapsDataObj[dateKey].push(info);
  // console.log('snapsDataObj---', snapsDataObj);
  saveSnapSeekData(snapsDataObj);
}

const listerSnapSeekData = () => {
  // 历史记录
  window.addEventListener('load', () => {
    const debounceLoad = debounce(() => {
      SaveSnapSeek();
    }, 500);
    debounceLoad();
    // 监听body中元素有更新
    let status = false;
    const observer = new MutationObserver(() => {
      if (status) return;
      status = true;
      setTimeout(() => {
        debounceLoad();
      }, 1000);
    });
    observer.observe(document.body, { childList: true, subtree: false, attributes: false });
  });
};

export { listerSnapSeekData };
