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
