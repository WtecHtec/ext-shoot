import { Topic } from '~component/cmdk/topic/topic';

export const GoogleSearchTopic = new Topic({
  name: 'Google',
  language: 'en',
  appearance: {
    backgroundColor: '#1a73e8',
    textColor: '#FFFFFF'
  },
  conditions: [{ type: 'hostSuffix', value: 'google.com' }]
});

export const MetasoTopic = new Topic({
  name: '秘塔Al搜索',
  language: 'zh',
  appearance: {
    backgroundColor: '#1570ef',
    textColor: '#FFFFFF'
  },
  conditions: [{ type: 'hostSuffix', value: 'metaso.cn' }]
});
