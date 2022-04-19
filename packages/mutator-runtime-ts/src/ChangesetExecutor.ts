import { Changeset } from 'Changeset';

// TODO should we collapse multiple mutations of the same model into a single CS?
export default function changesetExecutor(changesets: Changeset<any, any>[]) {
  // Go thru changesets
  // Group into batches that could be batched based on storage being hit
  // We could batch here or in the db resolver on the next tick
  // How shall we return results back out to our users?
  // Supply `return` to changeset creation?
  // return tuples?
}
