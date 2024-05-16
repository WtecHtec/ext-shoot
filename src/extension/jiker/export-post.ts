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
    createdAt,
    content,
    pictures,
    linkInfo,
    likeCount,
    commentCount,
    repostCount,
    shareCount,
    topic,
}) => {
    const userName = _.get(user, 'screenName', '');
    const filteredPictures = Array.isArray(pictures) ? pictures.map(({ picUrl }) => picUrl).join(",") : '';
    const topicContent = _.get(topic, 'content', '');
    const parsedCreatedAt = new Date(createdAt);
    const formattedDate = parsedCreatedAt.toLocaleDateString(); // Get date
    const formattedTime = parsedCreatedAt.toLocaleTimeString(); // Get time

    return {
        id,
        user: userName,
        date: formattedDate,
        topic: topicContent,
        content: content || '',
        pictures: filteredPictures,
        link: _.get(linkInfo, 'linkUrl', ''),
        time: formattedTime,
        like: _.defaultTo(likeCount, 0),
        comment: _.defaultTo(commentCount, 0),
        repost: _.defaultTo(repostCount, 0),
        share: _.defaultTo(shareCount, 0),
    };
};


// 批量处理数据数组的函数
export const filterDataArray = (dataArray) => {
    return dataArray.map(filterMeta);
};

import { Parser } from '@json2csv/plainjs';
import * as  XLSX from 'xlsx';
import toast from '~component/cmdk/toast';
import { getUserAllPosts } from './api';


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
        ws['!cols'][2] = { wch: 10 };
        ws['!cols'][3] = { wch: 20 };
        ws['!cols'][4] = { wch: 100 };

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


export const exportUserPosts = async () => {
    if (!isUserDetailPage()) {
        toast("只能在个人页使用哦");
        return;
    }
    toast("好咧，我要开始咯");
    const userId = extractUserIdFromUrl();
    const post = await getUserAllPosts(userId,);
    // console.log('post', post);
    const result = filterDataArray(post);
    // console.log('result', result);
    const url = await convertToExcel(result);
    const userName = abstractUserName();
    // triggerDownload(url, `${userName}_all_post.csv`);
    triggerDownload(url, `${userName}-posts.xlsx`);
    toast("活已干完，快去看看吧");
};