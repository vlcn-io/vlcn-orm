import { SID_of } from "@strut/sid";
import PersistedModel from "./PersistedModel.js";

/**
 * Represents a yet to be resolved reference to a model.
 *
 * This is "yet to be resolved" either because the model has not been created yet
 * or because it has not been loaded from storage yet.
 *
 * Likely should create sub-types for each case.
 */
export default class ModelReference<T> extends PersistedModel<{
  id: SID_of<T>;
}> {
  constructor(id: SID_of<T>, private aSchemaName: string) {
    super({ id });
  }

  get schemaName() {
    return this.aSchemaName;
  }

  toStorage(): Object {
    throw new Error("Cannot persist a reference");
  }
}
