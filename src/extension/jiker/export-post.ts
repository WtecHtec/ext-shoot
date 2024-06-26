import { Parser } from '@json2csv/plainjs';
import $ from 'jquery';
import defaultTo from 'lodash.defaultto';
import get from 'lodash.get';
import * as XLSX from 'xlsx';

import toast from '~component/cmdk/toast';
import { buildCrossTab } from '~lib/function-manager';

import { getPostsMetail, getUserAllPosts } from './api';

/**
 * 判断当前URL是否为用户详情页
 * 支持的URL格式:
 * - https://web.okjike.com/u/{userId}
 * @returns {boolean} 如果是用户详情页返回true，否则返回false
 */
export function isUserDetailPage() {
  const url = window.location.href;
  const userDetailRegex = /https:\/\/web\.okjike\.com\/u\/[0-9a-zA-Z-]+$/;
  return userDetailRegex.test(url);
}

export function abstractUserName() {
  if (!isUserDetailPage()) {
    return null;
  }
  // 从文档中获取用户名的元素并返回其文本内容
  const userName = $('[class*="jpfEiy"]');
  return userName.text();
}

/**
 * 从当前URL中提取用户ID
 * 只从用户详情页的URL格式中提取
 * @label: user.dom
 * @returns {string|null} 返回用户ID或者null
 */
export function extractUserIdFromUrl() {
  const url = window.location.href;
  const match = url.match(/https:\/\/web\.okjike\.com\/u\/([0-9a-zA-Z-]+)$/);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}

// 过滤单个对象的函数
const filterMeta = ({
  id,
  user,
  type,
  createdAt,
  content,
  pictures,
  linkInfo,
  likeCount,
  commentCount,
  repostCount,
  shareCount,
  topic,
  video
}) => {
  const userName = get(user, 'screenName', '');
  const filteredPictures = Array.isArray(pictures) ? pictures.map(({ picUrl }) => picUrl).join(',') : '';
  const topicContent = get(topic, 'content', '');
  const parsedCreatedAt = new Date(createdAt);
  const videoUrl = video ? video : '';
  const formattedDate = parsedCreatedAt.toLocaleDateString(); // Get date
  const formattedTime = parsedCreatedAt.toLocaleTimeString(); // Get time
  const type_ = type === 'ORIGINAL_POST' ? 'originalPost' : 'repost';
  return {
    id,
    user: userName,
    topic: topicContent,
    content: content || '',
    date: formattedDate,
    time: formattedTime,
    pictures: videoUrl ? videoUrl : filteredPictures,
    link: get(linkInfo, 'linkUrl', ''),
    like: defaultTo(likeCount, 0),
    comment: defaultTo(commentCount, 0),
    repost: defaultTo(repostCount, 0),
    share: defaultTo(shareCount, 0),
    url: `https://web.okjike.com/${type_}/${id}`
  };
};

// 批量处理数据数组的函数
export const filterDataArray = (dataArray) => {
  return dataArray.map(filterMeta);
};

// 获取视频
export const addVideoUrl = async (dataArray) => {
  const promises = dataArray.map(async (item) => {
    if (item.video) {
      const url = await getPostsMetail(item.id);
      item.video = url;
    } else {
      item.video = '';
    }
    return item;
  });

  return Promise.all(promises);
};

export const convertToCSV = (dataArray: any[]): string | null => {
  try {
    // 创建 CSV 转换器
    const parser = new Parser();
    // 将 JSON 数据转换为 CSV 格式的字符串
    const csvContent = parser.parse(dataArray);
    // 生成下载链接
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadLink = URL.createObjectURL(blob);
    return downloadLink;
  } catch (error) {
    console.error('Error converting to CSV:', error);
    return null;
  }
};

export const convertToExcel = (dataArray) => {
  try {
    console.log('Data array length:', dataArray.length);
    console.log('First object:', dataArray[0]);

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(dataArray);
    console.log('Worksheet:', ws); // 打印工作表对象
    // 设置第三列的宽度为 100 个字符
    if (!ws['!cols']) ws['!cols'] = [];

    ws['!cols'][0] = { wch: 26 };
    ws['!cols'][1] = { wch: 18 };
    ws['!cols'][2] = { wch: 22 };
    ws['!cols'][3] = { wch: 100 };
    ws['!cols'][4] = { wch: 12 };
    ws['!cols'][5] = { wch: 12 };

    XLSX.utils.book_append_sheet(wb, ws, 'posts');
    // 将工作簿转换为Excel文件的二进制数据
    const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    // 将二进制数据转换为Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // 生成下载链接
    const downloadLink = URL.createObjectURL(blob);
    return downloadLink;
  } catch (error) {
    console.error('Error converting to Excel:', error);
    return null;
  }
};

// 创建并触发下载
export const triggerDownload = (downloadLink: string, filename: string) => {
  const link = document.createElement('a');
  link.href = downloadLink;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const startExportProcess = async () => {
  if (!isUserDetailPage()) {
    toast('这个功能只能在个人列表页使用哦');
    return false;
  }
  toast('好咧，我要开始咯');
  return true;
};

const getProcessedUserPosts = async () => {
  const userId = extractUserIdFromUrl();
  const posts = await getUserAllPosts(userId);
  const postsWithVideo = await addVideoUrl(posts);
  return filterDataArray(postsWithVideo);
};
const getProcessedUserPostsWithOutVideo = async () => {
  const userId = extractUserIdFromUrl();
  const posts = await getUserAllPosts(userId);
  return filterDataArray(posts);
};

export const exportUserPostsToExcel = async () => {
  if (!(await startExportProcess())) return;

  const result = await getProcessedUserPostsWithOutVideo();
  toast(`一共发现 ${result.length} 篇博客，正在导出中...`);
  console.log('result', result);

  const url = await convertToExcel(result);
  const userName = abstractUserName();
  triggerDownload(url, `${userName}-posts.xlsx`);
  toast('活已干完，快去看看吧');
};

// async function detectIfLoginFeishu() {
//     const newPage = await buildCrossTab("https://fi0xqe16ql1.feishu.cn/base/TnXEbolXga6ne0s6VjJcszcBntd?table=tblQEj1Pzj8nYCPd&view=vewvTn7Nr7");
//     // const { result: ifLogin } = await newPage.actions().isLoggedInFeishu();
//     // if (!ifLogin) {
//     //     toast("请先登录飞书哦");
//     //     return false;
//     // }
//     const { result: ifUseTemplate } = await newPage.actionsFilter('jikeexportfeishu').executeUseageTemp(  '999999');
//     if (!ifUseTemplate) {
//         toast("请先使用模板哦");
//         return false;
//     }
//     await newPage.close();
//     return true;
// }

export const exportUserPostsToFeiShu = async () => {
  if (!(await startExportProcess())) return;
  const result = await getProcessedUserPosts();
  toast(`一共发现 ${result.length} 篇博客，正在导出中...`);
  // todo: 这里有问题，不能全部导出
  // console.log('result', result);
  if (!(await exportFeishu(result))) return;
};

async function exportFeishu(datas) {
  // 复制模板链接
  const copyUrl =
    'https://fi0xqe16ql1.feishu.cn/drive/create/?_tid=d19e4a50-18af-11ef-8e9e-8589b3bde5cf&_type=BEAR_CREATE_BY_TEMPLATE_NEW&extraInfo=%257B%257D&from=create_suite_template&searchParams=%257B%257D&teaExtraParams=%257B%257D&teaOption=%257B%2522template_token%2522%253A%25221fad8fa243aa39cb607623bf29eda9275028b841%2522%252C%2522template_name%2522%253A%2522542dc0c48d577f06f53c1a22e9662fb5c316111b%2522%252C%2522template_type%2522%253A%2522ugc%2522%252C%2522module%2522%253A%2522bitable%2522%252C%2522file_type%2522%253A%2522bitable%2522%252C%2522custom_open_source_backup%2522%253A%2522%2522%257D&teaSourceEvent=template_mark_banner&token=TnXEbolXga6ne0s6VjJcszcBntd&type=8&previous_navigation_time=1716432888694';
  const newPage = await buildCrossTab(copyUrl);
  await newPage.waitForLoad({
    regex: /https:\/\/([a-zA-Z0-9-]+).feishu.cn\/base\/([a-zA-Z0-9]+)\?table=([a-zA-Z0-9]+)/.toString().slice(1, -1)
  });
  await newPage.checkIfLoaded();
  console.log('newPage has load');
  const { result: ifUseTemplate } = await newPage.actions().executeExportFeishu(datas);
  if (!ifUseTemplate) {
    toast('请先使用模板哦');
    return false;
  }
  return true;
}
