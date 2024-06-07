import { RunEnv } from '../type';
import * as finder from './finder';

const moduleName = 'metaso';
const description = 'metaso web dom atoms';

const runEnv: RunEnv = ['dom'];

export const AtomDomMetaso = {
  name: moduleName,
  description,
  runEnv,
  finder
};
