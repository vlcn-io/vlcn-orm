import type { MemoryQuery, MemoryReadQuery, MemoryWriteQuery } from '@aphro/context-runtime-ts';
import { SID_of } from '@strut/sid';

/**
 * Holds all in-memory nodes in-memory.
 */
export default class MemoryDB {
  private collections: Map<string, { [key: SID_of<any>]: any }>;

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
    const collection = this.collections.get(q.tablish);
    if (collection == null) {
      return [];
    }
    switch (q.op) {
      case 'delete':
        q.models.forEach(m => delete collection[m.id]);
        return [];
      case 'create':
      case 'update':
        q.models.forEach(m => (collection[m.id] = m));
        return Object.values(q.models);
    }
  }

  dispose(): void {
    this.collections = new Map();
  }
}
