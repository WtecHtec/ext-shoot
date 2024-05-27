import { Topic } from '~component/cmdk/topic/topic';

export const jikeTopic = new Topic({
  name: '即刻',
  appearance: {
    backgroundColor: '#ffe411',
    textColor: '#000000' // 假设我们希望文本颜色为黑色
  },
  conditions: [{ type: 'hostSuffix', value: 'okjike.com' }]
});
