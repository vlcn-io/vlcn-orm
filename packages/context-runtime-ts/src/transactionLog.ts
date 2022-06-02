import Observable from '@strut/events';
import { Transaction } from './transaction.js';

type Node = {
  transaction: Transaction;
  next?: Node;
  prev?: Node;
};

export default class TransactionLog extends Observable<Transaction> {
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

    this.notify(tx);
  }
}
