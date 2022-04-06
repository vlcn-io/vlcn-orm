export interface PluggableModel {
  getOnly<T>(typePredicate: (x: any) => x is T): T;
}

export function getOnly<T>(typePredicate: (x: any) => x is T): T {
  for (let svc of this.data.services) {
    if (typePredicate(svc)) {
      return svc;
    }
  }
  throw new Error("No service found for type predicate " + typePredicate);
}
