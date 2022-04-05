// TODO: this should be in a separate package from the core model code.
import { useEffect, useReducer } from "react";
import { IModel } from "./Model.js";
import counter from "@strut/counter";

// TODO: use the new react18 external state hook thinger.
const count = counter("model-infra/Hooks");
export function useSubscription<T extends IModel<any>>(m: T): T {
  const [tick, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    count.bump("useSubscription." + m.constructor.name);
    // subscribe returns a function which will dispose of the subscription
    return m.subscribe(() => forceUpdate());
  }, [m]);

  return m;
}

export function useQuery<T>(keys: (keyof T)[], m: IModel<T>): void {
  const [tick, forceUpdate] = useReducer((x) => x + 1, 0);
  count.bump("useQuery." + m.constructor.name);
  useEffect(() => {
    count.bump("keyed.subscription." + m.constructor.name);
    // subscribe returns a function which will dispose of the subscription
    return m.subscribeTo(keys, () => forceUpdate());
  }, [m]);
}
