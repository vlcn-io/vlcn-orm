import type { MemoryQuery } from '@aphro/context-runtime-ts';

/**
 * Holds all in-memory nodes in-memory.
 */
export default class MemoryDB {
  async query(q: MemoryQuery): Promise<any[]> {
    return [];
  }
  dispose(): void {}
}
