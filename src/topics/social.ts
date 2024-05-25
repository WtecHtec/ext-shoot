import { Topic } from "~component/cmdk/topic/topic";

export const jikeTopic = new Topic({
    name: '即刻',
    appearance: {
        backgroundColor: '#ffe411',
        textColor: '#000000' // 假设我们希望文本颜色为黑色
    },
    conditions: [
        { type: 'domain', value: 'web.okjike.com' },
        { type: 'domain', value: 'm.okjike.com' }
    ]
});

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