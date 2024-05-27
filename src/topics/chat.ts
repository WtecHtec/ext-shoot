import { Topic } from '~component/cmdk/topic/topic';

export const feishuTopic = new Topic({
  name: '飞书',
  appearance: {
    backgroundColor: '#3e7fff',
    textColor: '#FFFFFF' // 假设我们希望文本颜色为白色
  },
  conditions: [{ type: 'hostSuffix', value: 'feishu.cn' }]
});
