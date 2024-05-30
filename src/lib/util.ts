import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { MarkId } from '~config/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getExtId = (id) => {
  const ids = id?.split(MarkId);
  return ids[ids.length - 1] ?? id;
};
