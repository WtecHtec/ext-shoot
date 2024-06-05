// 使用 async/await 从剪贴板获取第一张图片，不进行任何界面交互
export const getFirstImageFromClipboard = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    if (!clipboardItems.length) {
      return null; // 如果剪贴板为空，直接返回null
    }

    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          const blob = await clipboardItem.getType(type);
          return new File([blob], `clipboard-image.${type.split('/')[1]}`, {
            type: type
          }); // 直接返回找到的第一张图片
        }
      }
    }

    return null; // 如果没有找到图片，返回null
  } catch (error) {
    console.error(`读取剪贴板失败: ${error}`);
    return null; // 在发生错误时返回null
  }
};
