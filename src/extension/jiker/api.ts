import { getJikeToken } from "./handle";
import { JikeClient, ApiOptions } from "jike-api";

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
    console.log('Post Details:', postDetails);
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
    postType: "originalPost" | "repost";
}) => {
    const client = await initJikeClient();

    // 确定帖子类型
    const type_ = postType === "originalPost" ? ApiOptions.PostType.ORIGINAL : ApiOptions.PostType.REPOST;

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
