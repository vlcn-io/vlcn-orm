import type {
  MemoryQuery,
  MemoryReadQuery,
  MemoryResolvedDB,
  MemoryWriteQuery,
} from '@aphro/context-runtime-ts';
import { SID_of } from '@strut/sid';
import { assertUnreachable } from '@strut/utils';

/**
 * Holds all in-memory nodes in-memory.
 */
export default class MemoryDB {
  private collections: Map<string, { [key: SID_of<any>]: any }> = new Map();

  async query(q: MemoryQuery): Promise<any[]> {
    const type = q.type;
    switch (type) {
      case 'read':
        return await this.read(q);
      case 'write':
        await this.write(q);
        return [];
      default:
        assertUnreachable(type);
    }
  }

  async read(q: MemoryReadQuery): Promise<any[]> {
    const collection = this.collections.get(q.tablish);
    if (collection == null) {
      return [];
    }

    if (q.roots == null) {
      return Object.values(collection);
    }

    return q.roots.map(r => collection[r]);
  }

  async write(q: MemoryWriteQuery): Promise<void> {
    const c = this.collections.get(q.tablish);
    let collection: { [key: SID_of<any>]: any };
    // To make the type checker happy
    if (c == null) {
      collection = {};
      this.collections.set(q.tablish, collection);
    } else {
      collection = c;
    }

    switch (q.op) {
      case 'delete':
        q.models.forEach(m => delete collection[m.id]);
      case 'upsert':
        q.models.forEach(m => (collection[m.id] = m));
    }
  }

  transact<T>(cb: (conn: MemoryDB) => Promise<T>): Promise<T> {
    // changesets already represent in-memory transactions.
    // nothing to do here.
    return cb(this);
  }

  dispose(): void {
    this.collections = new Map();
  }
}
