import { Topic } from '~component/cmdk/topic/topic';

export const bilibiliTopic = new Topic({
  name: '哔哩哔哩',
  language: 'zh',
  appearance: {
    backgroundColor: '#00A1D6',
    textColor: '#FFFFFF' // 假设我们希望文本颜色为白色
  },
  conditions: [{ type: 'hostEquals', value: 'bilibili.com' }]
});
