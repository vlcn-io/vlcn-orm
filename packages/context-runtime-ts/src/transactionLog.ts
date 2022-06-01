import Observable from '@strut/events';

type Node<T> = {
  transaction: T;
  next?: Node<T>;
  prev?: Node<T>;
};

export default class TransactionLog<T> extends Observable<T> {
  private lastTransaction?: Node<T>;
  private firstTransaction?: Node<T>;
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

  push(tx: T) {
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
