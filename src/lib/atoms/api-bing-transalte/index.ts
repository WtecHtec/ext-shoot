import { RunEnv } from '../type';
import { mightBeChinese, translateText, translateToEnglish } from './custom';

const moduleName = 'bing-translate';
const description = 'Bing Translate API';
const methods = {
  translateText,
  translateToEnglish,
  mightBeChinese
};

const runEnv: RunEnv = ['api'];

export default {
  name: moduleName,
  description,
  runEnv,
  action: {
    ...methods
  },
  methods
};
