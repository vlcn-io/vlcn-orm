/*

*/

import { Context } from '@aphro/context-runtime-ts';
import { IPlan } from '../Plan.js';
import { Query } from '../Query.js';

type Event = {
  type: 'pending' | 'update';
};

type Status = 'pending' | 'resolved';

class LiveResult<T> {
  #latest?: T;
  #subscribers: Set<(data: T) => void>;
  #status: Status = 'pending';
  #optimizedQueryPlan: IPlan;
  #implicatedDatasets: Set<string>;

  constructor(ctx: Context, query: Query<T>) {
    this.#optimizedQueryPlan = query.plan().optimize();
    this.#implicatedDatasets = query.implicatedDatasets();

    // ctx.commitLog.on((tx) => {if (this.#matters(tx)) { tx.persist.then(this.#react) }})

    /*
    How should we convert a query into a reactive plan?

    A reactive plan --
    1. List of tables hit
    2. List of expressions

    Mutated a thing in a hit table?
    Jump to that section in the plan.
    Look at the prior hop.
    Incorporate the prior hop's condition into a filter.

    MVP would just be to re-run the entire query if _any_ implicated table was updated.

    Better would be to do this in-memory with the chaining of chunked iterables.

    Second stage, and later, hops are non-optimizable however?
    user.queryDecks().querySlides().queryComponents()
                       ^-- we don't know if the new/modified slide matches the join condition since the JC is unbound.
                       Well do we not?
                       join conditions would be on primary keys, fields and junctions.
                       we'd need to know if `slide.deckId` is within the set returned by `queryDecks`
    
    MVP live queries will be non-optimistic unfortunately.
    We can listen to `persistor` or we can listen to a transaction log.
    */
  }

  on(subscriber: (data: T) => void) {
    this.#subscribers.add(subscriber);
  }

  off(subscriber: (data: T) => void) {
    this.#subscribers.delete(subscriber);
  }

  get latest() {
    return this.#latest;
  }

  get status() {
    return this.#status;
  }
}

/*
u.qeryAll().live().subscribe(d => ...);
*/
