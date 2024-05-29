import { RunEnv } from '../type';
import { triggerClickOnElement } from './click';

const moduleName = 'web-interaction';
const description = 'common web interaction methods';
const methods = {
  triggerClickOnElement
};

const runEnv: RunEnv = ['dom'];

export default {
  name: moduleName,
  description,
  runEnv,
  action: {
    ...methods
  },
  methods
};
