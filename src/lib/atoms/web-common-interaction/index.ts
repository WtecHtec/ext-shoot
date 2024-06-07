import { RunEnv } from '../type';
import { triggerFromCursor } from './cursor';
import { triggerFromElement } from './form';
import { keyPress } from './key-press';

const moduleName = 'web-interaction';
const description = 'extension web interaction methods';
const methods = {
  triggerFromCursor,
  triggerFromElement,
  keyPress
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
