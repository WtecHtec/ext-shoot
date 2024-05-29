import { RunEnv } from '../type';
import { triggerFromCursor } from './cursor';
import { triggerFromElement } from './form';

const moduleName = 'web-interaction';
const description = 'common web interaction methods';
const methods = {
  triggerFromCursor,
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
