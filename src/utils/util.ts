function getMutliLevelProperty(ctx, path, defaultVal) {
  let res = defaultVal;
  if (!(typeof path === 'string') || !isObject(ctx)) return res;
  let key = path.replace(/\[(\w+)\]/g, '.$1');
  key = key.replace(/^\./, '');
  const arr = key.split('.');
  for (let i = 0, count = arr.length; i < count; i++) {
    const p = arr[i];
    if ((isObject(ctx) || Array.isArray(ctx)) && p in ctx) {
      ctx = ctx[p];
    } else {
      return res;
    }
  }
  res = ctx;
  return res;
}

function isObject(obj) {
  const type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

function getIcon(icons) {
  if (!icons || icons.length === 0) return '/assets/ext-icon.png';

  let max = 0;
  let maxIndex = 0;
  icons.forEach((item, index) => {
    if (item.size > max && item.size <= 128) {
      max = item.size;
      maxIndex = index;
    }
  });
  return icons[maxIndex].url;
}

// 创建一个函数，接收 icon url 返回 base64 对象
function getBase64FromIconUrl(iconUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', iconUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data as string);
        };
        reader.onerror = () => {
          reject(new Error('Failed to convert blob to base64'));
        };
        reader.readAsDataURL(blob);
      } else {
        reject(new Error(`Failed to fetch icon: ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => {
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

function deepCopyByJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getId() {
  return Date.now().toString(36);
}

// bug TODO: 无法识别 edge dev 和 chrome dev
function getBrowser() {
  const browserType = navigator.userAgent.toLowerCase();
  let result = 'chrome';
  if (browserType.indexOf('chrome') > -1) {
    result = 'chrome';
  } else if (browserType.indexOf('firefox') > -1) {
    result = 'firefox';
  } else if (browserType.indexOf('safari') > -1) {
    result = 'safari';
  } else if (browserType.indexOf('edge') > -1) {
    result = 'edge';
  } else {
    result = 'other';
  }
  return result;
}

export const isArc = () => {
  // 等待ms，等待arc的css变量加载
  //
  const arcPaletteTitle = getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title');
  return !!arcPaletteTitle;
};

function isMac() {
  return /mac/i.test(navigator?.platform);
}

function isWindow() {
  return /win/i.test(navigator?.platform);
}

function getPlatform() {
  if (isMac()) return 'mac';
  if (isWindow()) return 'win';
  return 'other';
}

function formatDate(date: Date, fmt: string) {
  const o: { [key: string]: number } = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] + '' : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}
function getPageInfo() {
  const pageText = document.body.innerText.trim();
  const pageIcon = document.querySelector('link[rel="icon"]')?.getAttribute('href');
  const pageUrl = window.location.href;
  const pageTitle = document.title;
  return {
    text: pageText,
    icon: pageIcon,
    url: pageUrl,
    title: pageTitle,
    time: new Date().getTime()
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(func: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}

export {
  getMutliLevelProperty,
  getIcon,
  getBase64FromIconUrl,
  deepCopyByJson,
  getId,
  getBrowser,
  getPlatform,
  formatDate,
  getPageInfo,
  debounce
};
