import { Spec } from "../Model.js";
import { DerivedQuery, HopQuery, Query } from "./Query.js";
import SQLHopQuery from "./sql/SqlHopQuery.js";
import SQLSourceQuery from "./sql/SqlSourceQuery.js";

// Runtime factory so we can swap to `Wire` when running on a client vs
// the native platform.
const factory = {
  createSourceQueryFor<T>(spec: Spec<T>): Query<T> {
    switch (spec.storageDescriptor.type) {
      case "sql":
        return new SQLSourceQuery(spec);
      default:
        throw new Error(spec.storageDescriptor.type + " is not yet supported");
    }
  },

  createHopQueryFor<TDest>(
    priorQuery: DerivedQuery<any>,
    sourceSpec: Spec<any>,
    destSpec: Spec<TDest>
  ): HopQuery<any, TDest> {
    // SQLHopQuery and so on
    if (destSpec.storageDescriptor.type === "sql") {
      return SQLHopQuery.create(priorQuery, sourceSpec, destSpec);
    }

    throw new Error("Unimplemented hop");
  },
};

export default factory;
