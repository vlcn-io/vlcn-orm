type FetchFrag<T extends { fetch: (...args: any) => any }, K extends string> = Awaited<
  ReturnType<T['fetch']>
>[K];

type Frags<T extends { fetch: (...args: any) => any }> = Awaited<ReturnType<T['fetch']>>;
