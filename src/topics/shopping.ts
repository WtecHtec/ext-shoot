import { Topic } from '~component/cmdk/topic/topic';

export const duoZhuaYuTopic = new Topic({
  name: '多抓鱼',
  language: 'zh',
  appearance: {
    backgroundColor: '#497749',
    textColor: '#FFFFFF'
  },
  conditions: [{ type: 'hostSuffix', value: 'duozhuayu.com' }]
});
