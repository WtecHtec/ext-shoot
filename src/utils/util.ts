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
    return '/assets/ext-icon.png'

  let max = 0
  let maxIndex = 0
  icons.forEach((item, index) => {
    if (item.size > max && item.size <= 128) {
      max = item.size
      maxIndex = index
    }
  })
  return icons[maxIndex].url
}

function getBase64FromImageUrl(url): Promise<(string | ArrayBuffer)> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL("image/png");
      resolve(base64);
    };
  })
}
export {
  getMutliLevelProperty,
  getIcon,
  getBase64FromImageUrl,
}