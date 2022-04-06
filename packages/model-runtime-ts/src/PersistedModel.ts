import { deviceId } from "@strut/sid";
import sid, { SID_of } from "@strut/sid";
import Model, { HasId } from "./Model.js";
import { changeset, Changeset } from "./Changeset.js";
import { invariant } from "@strut/utils";

// TODO: sid_of<child> ...
// Prevent id from being provided by child type:
// https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined
export default abstract class PersistedModel<
    T extends { id: SID_of<any> },
    E extends Object = {}
  >
  extends Model<T, E>
  implements HasId
{
  public abstract readonly schemaName: string;

  get id(): SID_of<this> {
    return this.data.id;
  }

  static newId(): SID_of<any /*this*/> {
    return sid(deviceId());
  }

  isNoop(newData: Partial<T>): boolean {
    // TODO: id is set? It is a new creation... we'll process these for now /
    // until we can do construction via change events
    if (newData.id != null) {
      return false;
    }
    return super.isNoop(newData);
  }

  change(newData: Partial<T>): Changeset<this, T> | null {
    // TODO: forcing TypeScript to exclude ID from the newData param
    // calls untold errors.
    invariant(
      newData.id == undefined,
      "You cannot change the id of an object."
    );
    return changeset(this, newData);
  }

  abstract toStorage(): Object;
}
