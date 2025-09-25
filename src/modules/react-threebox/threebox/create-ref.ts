import type { ThreeboxInstance } from '..//types/lib';
import type Threebox from './threebox-plugin';

export type ThreeboxRef = ThreeboxInstance & {
  getThreebox: () => ThreeboxInstance | undefined;
  [key: string]: any;
};

export function createThreeboxRef(tbInstance: Threebox): ThreeboxRef | undefined {
  if (!tbInstance) {
    return undefined;
  }

  let tb: ThreeboxInstance | undefined = tbInstance.tb;

  if (!tb) {
    return undefined;
  }

  const result: ThreeboxRef = {
    getThreebox: () => tb,
  };

  for (const key of getMethodNames(tb)) {
    if (!(key in result)) {
      result[key] = tb[key].bind(tb);
    }
  }

  return result;
}

function getMethodNames(obj: Record<string, any>) {
  const result = new Set<string>();

  let proto = obj;
  while (proto) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (
        key[0] !== '_' &&
        typeof obj[key] === 'function' &&
        key !== 'fire' &&
        key !== 'setEventedParent'
      ) {
        result.add(key);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return Array.from(result);
}
