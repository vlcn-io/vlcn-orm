import { StorageEngine, StorageType } from '@aphro/schema-api';
import { DBResolver, EngineToResolved, ResolvedDB } from './DBResolver.js';

export const printResolver: DBResolver = spyResolver(function () {
  console.log(arguments);
});

export const noopResolver: DBResolver = spyResolver(() => {});

export function spyResolver(spy: (...args: any) => any): DBResolver {
  return {
    engine(engine: StorageEngine) {
      return {
        db(db: string) {
          return spyProxy(spy) as any;
        },
      };
    },
  };
}

function spyProxy(spy: (...args: any[]) => any) {
  const objProxyDef = {
    get(target, prop, receiver) {
      spy(prop);
      return new Proxy(() => {}, fnProxyDef);
    },
  };

  const fnProxyDef = {
    apply(target, thisArg, args) {
      spy(args);
      return new Proxy({}, objProxyDef);
    },
  };

  return new Proxy({}, objProxyDef);
}

export function basicResolver<X extends StorageEngine>(resolved: EngineToResolved[X]): DBResolver {
  return {
    engine<E extends StorageEngine>(e: E) {
      return {
        db(db: string) {
          // TOOD: some sort of invariant to ensure E === X?
          return resolved as unknown as EngineToResolved[E];
        },
      };
    },
  };
}
