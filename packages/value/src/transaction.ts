import { newScope } from "@aphrodite.sh/context-provider";
import { memory, MemoryVersion } from "./memory.js";
import { IValue } from "./Value.js";

export const inflight: Transaction[] = [];

export type Transaction = {
  readonly touched: Map<IValue<any>, any>;
  readonly memoryVersion: MemoryVersion;
};

export function transaction(): Transaction {
  return {
    memoryVersion: memory.version,
    touched: new Map(),
  };
}

export function tx<T>(fn: () => T): T {
  const tx = transaction();
  inflight.push(tx);
  try {
    let ret = newScope(fn, {
      tx,
    });

    // if ret is a promise we must then it.
    if (typeof ret?.then === "function") {
      ret = ret.then(
        (result: any) => {
          inflight.splice(inflight.indexOf(tx), 1);
          commit(tx);
          return result;
        },
        (reason: any) => {
          inflight.splice(inflight.indexOf(tx), 1);
          throw reason;
        }
      );
    } else {
      // removal from inflight before committing is intentional
      // so history knows to or not to add the change.
      // commit is atomic so this is ok.
      inflight.splice(inflight.indexOf(tx), 1);
      commit(tx);
    }

    return ret;
  } catch (e) {
    const idx = inflight.indexOf(tx);
    if (idx != -1) {
      inflight.splice(idx, 1);
    }

    throw e;
  }
}

function commit(tx: Transaction) {
  for (const [value, data] of tx.touched.entries()) {
    value.__commit(data);
  }

  for (const value of tx.touched.keys()) {
    value.__transactionComplete();
  }
}
