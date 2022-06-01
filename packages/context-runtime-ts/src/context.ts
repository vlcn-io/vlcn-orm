import { Viewer } from './viewer.js';
import { DBResolver } from './DBResolver.js';
import { printResolver } from './resolvers.js';
import Cache from '@aphro/cache-runtime-ts';
import TransactionLog from './transactionLog.js';

export type Context = {
  readonly viewer: Viewer;
  readonly dbResolver: DBResolver;
  readonly cache: Cache;
  // TODO: we need to move the definition of `Transaction` so it is usable here.
  readonly commitLog: TransactionLog<any>;
};

const defaultCommitLog = new TransactionLog(50);

/**
 * TODO: we should likely hide the cache parameter from the user so they don't shoot themselves in the foot
 * with respect to privacy by reusing the same cache across viewers.
 * @param viewer The current user that is viewing data
 * @param dbResolver The db lookup service
 * @param cache The cache to store resolved queries to.
 * @returns
 */
export default function context(
  viewer: Viewer,
  dbResolver: DBResolver,
  cache: Cache,
  commitLog: TransactionLog<any> = defaultCommitLog,
): Context {
  return {
    viewer,
    dbResolver,
    cache,
    commitLog,
  };
}

export function debugContext(viewer: Viewer): Context {
  return context(viewer, printResolver, new Cache());
}

export function newFrom(oldContext: Context, newValues: Partial<Context>): Context {
  return {
    ...oldContext,
    ...newValues,
  };
}
