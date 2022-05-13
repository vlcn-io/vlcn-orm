import { Viewer } from './viewer';
import { DBResolver } from './DBResolver';
import { printResolver } from './resolvers';

export type Context = {
  readonly viewer: Viewer;
  readonly dbResolver: DBResolver;
  // readonly commitLog: TransactionLog;
};

// const defaultCommitLog = new TransactionLog(50);

export default function context(
  viewer: Viewer,
  dbResolver: DBResolver,
  // commitLog: TransactionLog = defaultCommitLog,
): Context {
  return {
    viewer,
    dbResolver,
    // commitLog,
  };
}

export function debugContext(viewer: Viewer): Context {
  return context(viewer, printResolver);
}

export function newFrom(oldContext: Context, newValues: Partial<Context>): Context {
  return {
    ...oldContext,
    ...newValues,
  };
}
