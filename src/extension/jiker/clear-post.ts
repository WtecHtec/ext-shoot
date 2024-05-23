// 第1步获取当前登录账号的id
// 第2步获取这个id下所有的帖子的id 和 postType
// 第3步循环 将这些所有帖子的id的内容全部删除 

import toast from "~component/cmdk/toast";
import { deletePostById, getUserAllPosts } from "./api";
import { getCurrentUserProfile, gotoPageMe } from "./handle";
const confirmAndExecute = async (message, onConfirm) => {
    toast(message, {
        action: {
            label: '删吧',
            onClick: onConfirm,
        },
        duration: 4000,
    });
};

type Post = {
    id: string;
    type: string;
};

const fetchUserPosts = async (username): Promise<Post[]> => {
    return new Promise((resolve, reject) => {
        getUserAllPosts(username).then(resolve).catch(reject);
    });
};

const deletePosts = async (userPosts) => {
    for (const post of userPosts) {
        const { id, type } = post;
        console.log(`正在删除编号为 ${id} 的${type === 'ORIGINAL_POST' ? '原创帖子' : '转发帖子'}...`);
        await deletePostById({ postId: id, postType: type });
    }
    // ORIGINAL_POST -> originalPost
    // REPOST -> repost

    // deletePostById({ postId: userPosts[0].id, postType: userPosts[0].type });
    toast('翻篇啦，欢迎走进新生活！');
    await gotoPageMe();
};

// 清空用户所有帖子，需要用户确认
export const clearUserPosts = async () => {
    try {
        const { username } = await getCurrentUserProfile();
        const totalPostsPromise = fetchUserPosts(username);

        toast.promise(
            totalPostsPromise,
            {
                loading: '正在寻找你帖子...',
                success: (userPosts) => {
                    if (userPosts.length > 0) {
                        const confirmMessage = `嘿，发现你有 ${userPosts.length} 篇帖子，你真的要把它们全删除吗？`;
                        confirmAndExecute(confirmMessage, () => deletePosts(userPosts));
                        // 假设 gotoPageMe() 跳转到某个页面
                        return '扫描完毕，等待你的决定...';
                    } else {
                        return '咦，没有找到要删除的帖子呢！';
                    }
                },
                error: '加载帖子时出错了'
            }
        );


    } catch (error) {
        console.error('清空帖子时遇到点问题：', error);
    }
};