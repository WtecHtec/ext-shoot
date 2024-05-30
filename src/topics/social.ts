import { Topic } from '~component/cmdk/topic/topic';

export const jikeTopic = new Topic({
  name: '即刻',
  language: 'zh',
  appearance: {
    backgroundColor: '#ffe411',
    textColor: '#000000' // 假设我们希望文本颜色为黑色
  },
  conditions: [{ type: 'hostSuffix', value: 'okjike.com' }]
});

export const juejinTopic = new Topic({
  name: '掘金',
  language: 'zh',
  appearance: {
    backgroundColor: '#1e80ff',
    textColor: '#ffffff' // 假设我们希望文本颜色为黑色
  },
  conditions: [{ type: 'hostSuffix', value: 'juejin.cn' }]
});
