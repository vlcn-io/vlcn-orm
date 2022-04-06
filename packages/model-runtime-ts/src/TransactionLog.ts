import Observable from "@strut/events";
import type { MergedChangesets, Transaction } from "./Changeset.js";
import { Task } from "./NotifyQueue.js";

type Node = {
  transaction: Transaction;
  next?: Node;
  prev?: Node;
};

export default class TransactionLog extends Observable<MergedChangesets> {
  private lastTransaction?: Node;
  private firstTransaction?: Node;
  private length: number = 0;

  constructor(private capacity: number) {
    super();
  }

  get hasTransaction() {
    return this.lastTransaction != null;
  }

  get hasNextTransaction() {
    return this.lastTransaction?.next != null;
  }

  push(tx: Transaction) {
    ++this.length;
    if (this.lastTransaction == null) {
      this.lastTransaction = this.firstTransaction = { transaction: tx };
    } else {
      const newNode = {
        transaction: tx,
        prev: this.lastTransaction,
      };
      this.lastTransaction.next = newNode;
      this.lastTransaction = newNode;
    }

    // At capacity? Drop the first TX
    if (this.length > this.capacity) {
      // The type system doesn't realize that length != 0 then firstTx != null
      this.firstTransaction = this.firstTransaction?.next;
      --this.length;
    }

    this.notify(tx.changesets);
  }

  revert() {
    // reverts the newest transaction
    const last = this.lastTransaction;
    if (!last) {
      return;
    }

    // move our tail pointer back. We do not pop since we may
    // want to un-revert.
    this.lastTransaction = this.lastTransaction?.prev;

    // apply the prior states
    this.applyAndNotify(last.transaction.priorStates);
  }

  unrevert() {
    // unreverts a prior revert, if possible
    const next = this.lastTransaction?.next;
    if (!next) {
      // We haven't reverted anything
      return;
    }

    // move foward to the thing we're applying
    this.lastTransaction = this.lastTransaction?.next;

    // apply the next states
    this.applyAndNotify(next.transaction.changesets);
  }

  // Should we delegate to the changeset executor for reverting transactions?
  private applyAndNotify(changesets: MergedChangesets): void {
    const notifications: Set<Task> = new Set();
    for (const [model, changes] of changesets) {
      const mergeResult = model._merge(changes);
      if (mergeResult == null) {
        continue;
      }
      const [_, notifs] = mergeResult;
      for (const task of notifs) {
        notifications.add(task);
      }
    }

    // all changes have been reverted. We can tell our observers now.
    // Should we do this tick or next tick?
    setTimeout(() => {
      for (const n of notifications) {
        n();
      }
      this.notify(changesets);
    }, 0);
  }
}
