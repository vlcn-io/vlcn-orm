/**
 * Predicates allow filtering of data in queries.
 *
 * Now you might be shocked by the predicate.
 *
 * If a predicate is going to be run in the data source (e.g., SQL)
 * why the heck does it have a `call` implementation!?!?!?
 *
 * As much as possible predicates are hoisted to the backend
 * and run in SQL and thus `call` is never invoked. Where this is not possible the data is returned
 * to the app and the predicate is applied in the application.
 *
 * See the comments in `./Field.ts` as well as the blog post
 * on query optimization: https://tantaman.com/2022-05-26-query-plan-optimization.html
 */
export type Predicate<Tv> =
  | Equal<Tv>
  | NotEqual<Tv>
  | LessThan<Tv>
  | GreaterThan<Tv>
  | LessThanOrEqual<Tv>
  | GreaterThanOrEqual<Tv>
  | In<Tv>
  | NotIn<Tv>
  | StartsWith
  | EndsWith
  | ContainsString
  | ExcludesString
  | Lambda<Tv>
  | AsyncLambda<Tv>;

export class Equal<Tv> {
  constructor(public readonly value: Tv) {}
  readonly type = 'equal';

  call(what: Tv): boolean {
    return what === this.value;
  }

  invert(): NotEqual<Tv> {
    return new NotEqual(this.value);
  }
}

export class NotEqual<Tv> {
  constructor(public readonly value: Tv) {}
  readonly type = 'notEqual';

  call(what: Tv): boolean {
    return what !== this.value;
  }

  invert(): Equal<Tv> {
    return new Equal(this.value);
  }
}

export class LessThan<Tv> {
  constructor(public readonly value: Tv) {}
  readonly type = 'lessThan';

  call(what: Tv): boolean {
    return what < this.value;
  }

  invert(): GreaterThan<Tv> {
    return new GreaterThan(this.value);
  }
}

export class GreaterThan<Tv> {
  constructor(public readonly value: Tv) {}
  readonly type = 'greaterThan';

  call(what: Tv): boolean {
    return what > this.value;
  }

  invert(): LessThan<Tv> {
    return new LessThan(this.value);
  }
}

export class LessThanOrEqual<Tv> {
  constructor(public readonly value: Tv) {}
  readonly type = 'lessThanOrEqual';

  call(what: Tv): boolean {
    return what <= this.value;
  }

  invert(): GreaterThanOrEqual<Tv> {
    return new GreaterThanOrEqual(this.value);
  }
}

export class GreaterThanOrEqual<Tv> {
  constructor(public readonly value: Tv) {}
  readonly type = 'greaterThanOrEqual';

  call(what: Tv): boolean {
    return what >= this.value;
  }

  invert(): LessThanOrEqual<Tv> {
    return new LessThanOrEqual(this.value);
  }
}

export class In<Tv> {
  constructor(public readonly value: Set<Tv>) {}
  readonly type = 'in';

  call(what: Tv): boolean {
    return this.value.has(what);
  }

  invert(): NotIn<Tv> {
    return new NotIn(this.value);
  }
}

export class NotIn<Tv> {
  constructor(public readonly value: Set<Tv>) {}
  readonly type = 'notIn';

  call(what: Tv): boolean {
    return !this.value.has(what);
  }

  invert(): In<Tv> {
    return new In(this.value);
  }
}

export class StartsWith {
  constructor(public readonly value: string) {}
  readonly type = 'startsWith';

  call(what: string): boolean {
    return what.startsWith(this.value);
  }

  // TODO: invert should be `does not start with` not `ends with`
  invert(): EndsWith {
    return new EndsWith(this.value);
  }
}

export class EndsWith {
  constructor(public readonly value: string) {}
  readonly type = 'endsWith';

  call(what: string): boolean {
    return what.endsWith(this.value);
  }

  invert(): StartsWith {
    return new StartsWith(this.value);
  }
}

export class ContainsString {
  constructor(public readonly value: string) {}
  readonly type = 'containsString';

  call(what: string): boolean {
    return what.indexOf(this.value) !== -1;
  }

  invert(): ExcludesString {
    return new ExcludesString(this.value);
  }
}

export class ExcludesString {
  constructor(public readonly value: string) {}
  readonly type = 'excludesString';

  call(what: string): boolean {
    return what.indexOf(this.value) === -1;
  }

  invert(): ContainsString {
    return new ContainsString(this.value);
  }
}

export class Lambda<Tv> {
  readonly type = 'lambda';
  constructor(public readonly value: (m: Tv) => boolean) {}

  call(what: Tv): boolean {
    return this.value(what);
  }
}

export class AsyncLambda<Tv> {
  readonly type = 'asyncLambda';
  constructor(public readonly value: (m: Tv) => Promise<boolean>) {}

  call(what: Tv): Promise<boolean> {
    return this.value(what);
  }
}

const P = {
  equals<Tv>(value: Tv) {
    return new Equal(value);
  },

  notEqual<Tv>(value: Tv) {
    return new NotEqual(value);
  },

  lessThan<Tv>(value: Tv) {
    return new LessThan(value);
  },

  greaterThan<Tv>(value: Tv) {
    return new GreaterThan(value);
  },

  lessThanOrEqual<Tv>(value: Tv) {
    return new LessThanOrEqual(value);
  },

  greaterThanOrEqual<Tv>(value: Tv) {
    return new GreaterThanOrEqual(value);
  },

  in<Tv>(value: Set<Tv>) {
    return new In(value);
  },

  notIn<Tv>(value: Set<Tv>) {
    return new NotIn(value);
  },

  startsWith(value: string) {
    return new StartsWith(value);
  },

  endsWith(value: string) {
    return new StartsWith(value);
  },

  // TODO: just contains and polymorphism based on provided type?
  containsString(value: string) {
    return new ContainsString(value);
  },

  excludesString(value: string) {
    return new ExcludesString(value);
  },

  lambda<Tv>(fn: (v: Tv) => boolean) {
    return new Lambda(fn);
  },

  asyncLambda<Tv>(fn: (v: Tv) => Promise<boolean>) {
    return new AsyncLambda(fn);
  },
};

export default P;

// inverse of predicate
// in set of prediate
// binary predicate?
// case sensitivity?

// export interface Predicate<Tv> {
//   readonly value: Tv;
//   call(Tv): boolean;
//   type:
//     | Equal<Tv>['type']
//     | NotEqual<Tv>['type']
//     | LessThan<Tv>['type']
//     | GreaterThan<Tv>['type']
//     | LessThanOrEqual<Tv>['type']
//     | GreaterThanOrEqual<Tv>['type']
//     | In<Tv>['type']
//     | NotIn<Tv>['type'];
// }
