import type { MemoryQuery, MemoryReadQuery, MemoryWriteQuery } from '@aphro/context-runtime-ts';
import { SID_of } from '@strut/sid';

/**
 * Holds all in-memory nodes in-memory.
 */
export default class MemoryDB {
  private collections: Map<string, { [key: SID_of<any>]: any }> = new Map();

  async query(q: MemoryQuery): Promise<any[]> {
    switch (q.type) {
      case 'read':
        return await this.read(q);
      case 'write':
        return await this.write(q);
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

  async write(q: MemoryWriteQuery): Promise<any[]> {
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
        return [];
      case 'upsert':
        q.models.forEach(m => (collection[m.id] = m));
        return Object.values(q.models);
    }
  }

  dispose(): void {
    this.collections = new Map();
  }
}
