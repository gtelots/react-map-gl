import { deepEqual } from './deep-equal';

export default function updateProperties<T extends TProps, TProps>(
  nextProps: TProps,
  currProps: TProps,
  defProps: TProps,
  obj: T,
  propsNames: (keyof TProps)[],
) {
  for (const propName of propsNames) {
    const newValue = nextProps[propName];
    const oldValue = currProps[propName];
    if (!deepEqual(newValue, oldValue)) {
      const defaultValue = defProps[propName];
      obj[propName] = (newValue || defaultValue) as T[keyof TProps];
    }
  }
  return obj;
}
