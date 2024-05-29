import { RunEnv } from '../type';
import { triggerClickOnElement } from './click';
import { triggerFromElement } from './form';

const moduleName = 'web-interaction';
const description = 'common web interaction methods';
const methods = {
  triggerClickOnElement,
  triggerFromElement
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
