import _ from 'lodash';
import $ from 'jquery';

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
    video,
}) => {
    const userName = _.get(user, 'screenName', '');
    const filteredPictures = Array.isArray(pictures) ? pictures.map(({ picUrl }) => picUrl).join(",") : '';
    const topicContent = _.get(topic, 'content', '');
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
        link: _.get(linkInfo, 'linkUrl', ''),
        like: _.defaultTo(likeCount, 0),
        comment: _.defaultTo(commentCount, 0),
        repost: _.defaultTo(repostCount, 0),
        share: _.defaultTo(shareCount, 0),
        url: `https://web.okjike.com/${type_}/${id}`,
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


import { Parser } from '@json2csv/plainjs';
import * as  XLSX from 'xlsx';
import toast from '~component/cmdk/toast';
import { getPostsMetail, getUserAllPosts } from './api';
import { buildCrossTab } from '~lib/function-manager';


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

        XLSX.utils.book_append_sheet(wb, ws, "posts");
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
        toast("这个功能只能在个人列表页使用哦");
        return false;
    }
    toast("好咧，我要开始咯");
    return true;
};

const getProcessedUserPosts = async () => {
    const userId = extractUserIdFromUrl();
    const posts = await getUserAllPosts(userId);
    const postsWithVideo = await addVideoUrl(posts);
    return filterDataArray(postsWithVideo);
};

export const exportUserPostsToExcel = async () => {
    if (!await startExportProcess()) return;

    const result = await getProcessedUserPosts();
    toast(`一共发现 ${result.length} 篇博客，正在导出中...`);
    console.log('result', result);

    const url = await convertToExcel(result);
    const userName = abstractUserName();
    triggerDownload(url, `${userName}-posts.xlsx`);
    toast("活已干完，快去看看吧");
};


async function detectIfLoginFeishu() {
    const newPage = await buildCrossTab("https://fi0xqe16ql1.feishu.cn/base/TnXEbolXga6ne0s6VjJcszcBntd?table=tblQEj1Pzj8nYCPd&view=vewvTn7Nr7");
    // const { result: ifLogin } = await newPage.actions().isLoggedInFeishu();
    // if (!ifLogin) {
    //     toast("请先登录飞书哦");
    //     return false;
    // }
    const { result: ifUseTemplate } = await newPage.actions().executeUseageTemp();
    if (!ifUseTemplate) {
        toast("请先使用模板哦");
        return false;
    }
    await newPage.close();
    return true;
}


export const exportUserPostsToFeiShu = async () => {
    if (!await detectIfLoginFeishu()) return;
    if (!await startExportProcess()) return;

    // const result = await getProcessedUserPosts();
    // toast(`一共发现 ${result.length} 篇博客，正在导出中...`);
    // console.log('result', result);

    // chrome.runtime.sendMessage({
    //     action: 'ac_create_feishu',
    //     data: [...result]
    // });
};
