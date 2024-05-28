import { Topic } from '~component/cmdk/topic/topic';

export const chatgptTopic = new Topic({
  name: 'ChatGPT',
  language: 'en',
  appearance: {
    backgroundColor: '#212121',
    textColor: '#FFFFFF'
  },
  conditions: [{ type: 'hostSuffix', value: 'chatgpt.com' }]
});
