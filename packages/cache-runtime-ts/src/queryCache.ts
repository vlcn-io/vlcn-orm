/**
 * The query cache is a partial cache, building on top of the regular cache.
 *
 * The "regular cache" retains key->value pairings (id->model) of every single object still in use by the application.
 *
 * The query cache retains query_string_and_args->returned_ids pairings. If there is a hit in this layer the ids
 * are sent to the id->model cache to be resolved to the actual objects.
 *
 * QueryCache returns can have three states:
 * - miss
 * - hit, fully resolved
 * - hit, stale
 *
 * "fully resolved" requires that:
 * 1. the query is single hop
 * 2. expressions in the original, un-optimized plan, are applied against the returned set.
 *  E.g., filters applied against the optimistic nodes.
 *   ^-- well.. this isn't exactly right. What if a field on a node is updated that would pull it into the set rather than
 *   remove it from the set? We can discover this by listening to creates and seeing if they match live queries or cached queries.
 *
 * "stale" applies to all other cases.
 *
 * So maybe we always return "stale" but "stale" with "optimistic nodes"
 */

import { SID_of } from '@strut/sid';

/**
 * cache key format is determined by the user of the cache.
 * E.g., SQLSource will use a different format than another source.
 * engine & db should be parts of the key.
 *
 * viewer does not need to be part of the key given the results are resolved against the
 * app cache which is viewer specific.
 *
 */
export default class QueryCache {
  // The cached result for a given key could be different based on projection.
  // IDs or Counts
  readonly #cache = new Map<string, any>();
  /**
   *
   * @param sizeInQueries number of queries to cache
   *
   * Note: if the app makes many unbounded queries this will
   * lead to a large cache size. Apps should not be doing
   * unbounded queries anyway though, right?
   *
   * An alternate approach is to bound the number of ids allowed in the cache.
   */
  constructor(public readonly sizeInQueries: number) {}

  get(key: string): SID_of<any>[] | null {
    return null;
  }

  set(key: string): void {}
}

/**
 * - query cache should have access to plans
 * - query cache should only cache single-hop queries
 * - query cache should listen to create/update/delete of models and add/remove/re-order them in query results
 */
