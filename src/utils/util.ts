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
	return type === 'function' || type === 'object' && !!obj;
}

function getIcon(icons) {
	if (!icons || icons.length === 0)
		return '/assets/ext-icon.png';

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


function getBrowser() {
	const browserType = navigator.userAgent.toLowerCase();
	let result = 'chrome';
	if (browserType.indexOf("chrome") > -1) {
		console.log("当前浏览器是 Chrome");
	} else if (browserType.indexOf("firefox") > -1) {
		console.log("当前浏览器是 Firefox");
	} else if (browserType.indexOf("safari") > -1) {
		console.log("当前浏览器是 Safari");
	} else if (browserType.indexOf("edge") > -1) {
		console.log("当前浏览器是 Edge");
		result = 'edge';
	} else if (browserType.indexOf("arc") > -1) {
		console.log("当前浏览器是 Edge");
		result = 'arc';
	} else {
		console.log("当前浏览器是其他浏览器");
	}
	return result;
}
export {
	getMutliLevelProperty,
	getIcon,
	getBase64FromIconUrl,
	deepCopyByJson,
  getId,
	getBrowser,
};