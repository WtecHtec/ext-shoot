import { RunEnv } from '../type';
import { triggerFromCursor } from './cursor';
import { triggerFromElement } from './form';

const moduleName = 'web-interaction';
const description = 'extension web interaction methods';
const methods = {
  triggerFromCursor,
  triggerFromElement
};

const runEnv: RunEnv = ['dom'];

export const AtomWebInteraction = {
  name: moduleName,
  description,
  runEnv,
  action: {
    ...methods
  },
  methods
};

export default AtomWebInteraction;
