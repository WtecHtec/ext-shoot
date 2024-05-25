import { Topic } from "~component/cmdk/topic/topic";

export const flomoTopic = new Topic({
    name: '浮墨笔记',
    appearance: {
        backgroundColor: '#30cf79',
        textColor: '#FFFFFF' // 假设我们希望文本颜色为白色
    },
    conditions: [
        { type: 'domain', value: 'v.flomoapp.com' }
    ]
});


// todo 域名可以用正则表达式 *.feishu.cn
export const feishuTopic = new Topic({
    name: '飞书',
    appearance: {
        backgroundColor: '#3e7fff',
        textColor: '#FFFFFF' // 假设我们希望文本颜色为白色
    },
    conditions: [
        { type: 'domain', value: 'connect-ai.feishu.cn' }
    ]
});