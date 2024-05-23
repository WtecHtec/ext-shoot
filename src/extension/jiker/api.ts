import axios from "axios";
import { getJikeToken } from "./handle";
import { JikeClient, ApiOptions } from "jike-api";
import CryptoJS from 'crypto-js';

// https://jike-api.vercel.app/
const apiConfig = {
    endpointId: 'jike',
    endpointUrl: 'https://api.ruguoapp.com/',
    bundleId: 'com.ruguoapp.jike',
    buildNo: '2961',
    appVersion: '7.56.2',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Jike/7.56.2 /sa-sdk-ios/sensors-verify/tr.ruguoapp.com?jike',
    accessToken: ''
};

// 单例模式保证JikeClient实例全局唯一
let clientInstance = null as JikeClient;

const getToken = async (tokenType) => {
    const tokenMap = await getJikeToken();
    return tokenMap.get(tokenType);
};

export const updateApiConfig = async () => {
    apiConfig.accessToken = await getToken("x-jike-access-token");
    console.log('apiConfig', apiConfig);
};

const initJikeClient = async () => {
    if (!clientInstance) {
        clientInstance = new JikeClient({
            ...apiConfig,
            refreshToken: await getToken("x-jike-refresh-token"),
        });
    }
    return clientInstance;
};

export const getUser = async () => {
    const client = await initJikeClient();
    const list = await client.apiClient.personalUpdate.single('29910575-F12D-4E48-9DDE-B25FE55D1F94', {
        limit: 10,
    });
    console.log('list', list.data.data);
};

export const getUserPosts = async (userId: string, maxNum = 2000) => {
    const client = await initJikeClient();
    let allPosts: any[] = [];
    let loadMoreKey: { lastId: string } | undefined = undefined;
    const limit = 500;

    while (allPosts.length < maxNum) {
        const response = await client.apiClient.personalUpdate.single(userId, {
            limit,
            loadMoreKey,
        });

        if (response.status !== 200 || !response.data) {
            throw new Error(`Failed to fetch user posts: ${response?.statusText}`);
        }

        allPosts = allPosts.concat(response.data.data);

        if (!response.data.loadMoreKey || allPosts.length >= maxNum) {
            break;
        }

        loadMoreKey = response.data.loadMoreKey;
    }

    if (allPosts.length > maxNum) {
        allPosts = allPosts.slice(0, maxNum);
    }

    return allPosts;
};

export const getUserAllPosts = async (userId: string
) => {
    const posts = await getUserPosts(userId, 999999999);
    return posts;
};


export const getPostDetails = async ({
    postId,
    postType,
}: {
    postId: string;
    postType: "originalPost" | "repost";
}) => {
    const client = await initJikeClient();
    const type_ = postType === "originalPost" ? ApiOptions.PostType.ORIGINAL : ApiOptions.PostType.REPOST;
    const postDetails = await client.apiClient.posts.get(type_, postId);
    // console.log('Post Details:', postDetails);
    return postDetails.data.data;
};


export const repostWithNewContent = async ({
    originalPostId,
    newContent,
    postType
}: {
    originalPostId: string;
    newContent: string;
    postType: "originalPost" | "repost";
}) => {
    const client = await initJikeClient();

    // 获取原始帖子的详情
    const type_ = postType === "originalPost" ? ApiOptions.PostType.ORIGINAL : ApiOptions.PostType.REPOST;
    const originalPostResponse = await client.apiClient.posts.get(type_, originalPostId);

    if (!originalPostResponse || !originalPostResponse.data || !originalPostResponse.data.data) {
        console.error('Failed to fetch the original post');
        return;
    }
    const originalPost = originalPostResponse.data.data;

    // 提取图片key
    const pictureKeys = originalPost.pictures?.map(picture => picture.key) || [];

    // 准备新帖子的数据
    const newPostData = {
        topicId: originalPost.topic ? originalPost.topic.id : undefined,
        pictureKeys: pictureKeys  // 使用图片keys数组
    };

    // 创建新帖子
    const newPostResult = await client.apiClient.posts.create(ApiOptions.PostType.ORIGINAL, newContent, newPostData);

    if (newPostResult && newPostResult.data && newPostResult.data.data) {
        console.log('New post created successfully with ID:', newPostResult.data.data.id);
        return newPostResult.data.data.id;
    } else {
        console.error('Failed to create new post');
    }
    return null;
};


export const deletePostById = async ({
    postId,
    postType
}: {
    postId: string;
    postType: "originalPost" | "repost" | "REPOST" | "ORIGINAL_POST";
}) => {
    const client = await initJikeClient();
    console.log('postId', postId);
    console.log('postType', postType);
    // 确定帖子类型
    const type_ = (postType === "originalPost" || postType === "ORIGINAL_POST")
        ? ApiOptions.PostType.ORIGINAL : ApiOptions.PostType.REPOST;
    // 删除帖子
    const deleteResult = await client.apiClient.posts.remove(type_, postId);

    if (deleteResult && deleteResult.data.success) {
        console.log('Post deleted successfully:', postId);
        return { success: true, message: 'Post deleted successfully' };
    } else {
        console.error('Failed to delete post:', postId);
        return { success: false, message: 'Failed to delete post' };
    }
};


export const getImageAsBlob = async (imageURL: string): Promise<Blob> => {
    try {
        const response = await axios({
            method: 'get',
            url: imageURL,
            responseType: 'arraybuffer'
        });
        return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};


// 引入 crypto-js 库

function calculateMD5FromBuffer(arrayBuffer) {
    // 将 ArrayBuffer 转换为 WordArray
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

    // 使用 crypto-js 计算 MD5
    return CryptoJS.MD5(wordArray).toString();
}


// 使用 CryptoJS 来进行 MD5 计算
export const uploadBlobToJike = async (blob) => {
    try {
        // 初始化Jike客户端
        const client = await initJikeClient();

        // 将Blob转换为ArrayBuffer，并计算MD5
        const buffer = await blob.arrayBuffer();
        const md5 = calculateMD5FromBuffer(buffer); // 假设已有此函数，或者需要你使用合适的库来实现

        // 获取上传凭证
        const tokenResponse = await client.apiClient.upload.token(md5);
        if (!tokenResponse || !tokenResponse.data || !tokenResponse.data.uptoken) {
            throw new Error('Failed to retrieve upload token');
        }
        const uploadToken = tokenResponse.data.uptoken;

        // 上传图片
        const uploadResult = await client.apiClient.upload.upload(blob, uploadToken);

        // 检查上传结果并返回
        if (uploadResult) {
            console.log('Image uploaded successfully');
            return {
                key: uploadResult.key,
                id: uploadResult.id,
                fileUrl: uploadResult.fileUrl
            };
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const uploadImageLinkToJike = async (imageURL: string) => {
    try {
        // 下载图片
        const imageBlob = await getImageAsBlob(imageURL);
        // 上传图片
        const uploadResult = await uploadBlobToJike(imageBlob);

        console.log('uploadResult', uploadResult);

        return uploadResult;
    } catch (error) {
        console.error('Error uploading image link:', error);
        throw error;
    }

};


export const createTextPost = async (content: string) => {
    const client = await initJikeClient();
    const result = await client.apiClient.posts.create(ApiOptions.PostType.ORIGINAL, content);
    return result;
};

export const cretatImagesPost = async (content: string, ...imageURLs: string[]) => {
    if (!imageURLs) {
        return createTextPost(content);
    }
    const client = await initJikeClient();
    const imageKeys = await Promise.all(imageURLs.map(url => uploadImageLinkToJike(url)));
    const result = await client.apiClient.posts.create(ApiOptions.PostType.ORIGINAL, content, { pictureKeys: imageKeys.map(image => image.key) });
    return result;
};

export const createJikePost = cretatImagesPost;
export const createPrivateImagesPost = async (content: string, ...imageURLs: string[]) => {
    if (!imageURLs) {
        return createTextPost(content);
    }
    const client = await initJikeClient();
    const imageKeys = await Promise.all(imageURLs.map(url => uploadImageLinkToJike(url)));
    const result = await client.apiClient.posts.create(ApiOptions.PostType.ORIGINAL, content, { pictureKeys: imageKeys.map(image => image.key), topicId: '5be41ae2a666dd00172d6072' });
    return result;
};


export const createPrivateTextPost = async (content: string) => {
    const client = await initJikeClient();
    const result = await client.apiClient.posts.create(ApiOptions.PostType.ORIGINAL, content, { topicId: '5be41ae2a666dd00172d6072' });
    return result;
};

export const getPostsMetail = async (postId: string) => {
	const client = await initJikeClient();
	return await client.mediaMeta(postId);
};