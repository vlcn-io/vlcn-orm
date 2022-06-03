import { UseQueryData } from './hooks.js';

type ExtractValue<T extends ReadonlyArray<UseQueryData<any>>> = {
  [K in keyof T]: T[K] extends UseQueryData<infer V> ? V[] : never;
};

export function unwrap<T extends ReadonlyArray<UseQueryData<any>>>(
  ...results: T
): ExtractValue<T> | undefined | null {
  if (results.some(r => r.status === 'error')) {
    return null;
  }

  if (results.some(r => r.status === 'loading')) {
    return undefined;
  }

  return results.map(r => (r.status === 'ready' ? r.data : null)) as any;
}

export function unwrapx<T extends ReadonlyArray<UseQueryData<any>>>(
  ...results: T
): ExtractValue<T> {
  const ret = unwrap(...results);
  if (ret === null) {
    throw 'error';
  }

  if (ret === undefined) {
    throw 'loading';
  }

  return ret;
}
