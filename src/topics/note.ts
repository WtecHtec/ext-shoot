import { Topic } from '~component/cmdk/topic/topic';

export const flomoTopic = new Topic({
  name: '浮墨笔记',
  appearance: {
    backgroundColor: '#30cf79',
    textColor: '#FFFFFF' // 假设我们希望文本颜色为白色
  },
  conditions: [{ type: 'hostSuffix', value: 'flomoapp.com' }]
});
