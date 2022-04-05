type Disposer = () => void;
import { SID_of } from "@strut/sid";
import { typedKeys } from "@strut/utils";
import { StorageConfig } from "./schema/parser/SchemaType.js";
import { Changeset } from "./Changeset.js";

export interface IModel<T extends Object> {
  change(newData: Partial<T>): Changeset<this, T> | null;
  delete(): [Changeset<this, T>, ...Changeset<Model<any, any>, any>[]];
  isNoop(newData: Partial<T>): boolean;
  subscribe(c: () => void): Disposer;
  subscribeTo(keys: (keyof T)[], c: () => void): Disposer;

  _merge(newData: Partial<T> | undefined): [Partial<T>, Set<() => void>] | null;
  _get<K extends keyof T>(key: K): T[K];
}

export type Spec<T extends Object> = {
  createFrom(data: T): IModel<T>;
  readonly storageDescriptor: StorageConfig;
};

export interface HasId {
  readonly id: SID_of<this>;
}

export function isHasId(object: any): object is HasId {
  return "id" in object && typeof object.id === "string";
}

export default class Model<T extends Object, E extends Object = {}>
  implements IModel<T>
{
  private subscriptions: Set<() => void> = new Set();
  private keyedSubscriptions: Map<keyof T, Set<() => void>> = new Map();

  private triggers: Map<keyof E, Set<(any) => (Changeset<any, any> | null)[]>> =
    new Map();

  constructor(private _data: T) {}

  change(newData: Partial<T>): Changeset<this, T> | null {
    return {
      type: "update",
      model: this,
      updates: newData,
    };
  }

  addTrigger<K extends keyof E>(
    event: K,
    cb: (data: E[K]) => (Changeset<any, any> | null)[]
  ) {
    let tfore = this.triggers.get(event);
    if (tfore == null) {
      tfore = new Set();
      this.triggers.set(event, tfore);
    }
    tfore.add(cb);
  }

  protected trigger<K extends keyof E>(
    event: K,
    data: E[K]
  ): Changeset<any, any>[] {
    const tfore = this.triggers.get(event);
    if (tfore == null) {
      return [];
    }

    const ret: Changeset<any, any>[] = [];
    for (const t of tfore) {
      const csets = t(data);
      for (const cs of csets) {
        if (cs != null) {
          ret.push(cs);
        }
      }
    }
    return ret;
  }

  delete(): [Changeset<this, T>, ...Changeset<Model<any, any>, any>[]] {
    return [
      {
        type: "delete",
        model: this,
        updates: undefined,
      },
    ];
  }

  _merge(
    newData: Partial<T> | undefined
  ): [Partial<T>, Set<() => void>] | null {
    const lastData = this._data;
    this._data = {
      ...this._data,
      ...newData,
    };
    let castLast = lastData as any;
    if (castLast.id !== undefined) {
      castLast.id = undefined;
    }

    let unchangedKeys = new Set();
    if (newData != null) {
      Object.entries(newData).forEach((entry) => {
        if (lastData[entry[0]] === entry[1]) {
          unchangedKeys.add(entry[0]);
        }
      });
    }

    const notifications = this.gatherNotifications(
      newData !== undefined
        ? unchangedKeys.size === 0
          ? typedKeys(newData)
          : typedKeys(newData).filter((k) => !unchangedKeys.has(k))
        : undefined
    );
    return [lastData, notifications];
  }

  _get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  isNoop(newData: Partial<T>): boolean {
    return Object.entries(newData).every(
      (entry) => this._data[entry[0]] === entry[1]
    );
  }

  protected get data() {
    return this._data;
  }

  subscribe(c: () => void): Disposer {
    this.subscriptions.add(c);
    return () => this.subscriptions.delete(c);
  }

  subscribeTo(keys: (keyof T)[], c: () => void): Disposer {
    keys.forEach((k) => {
      let subs = this.keyedSubscriptions.get(k);
      if (subs == null) {
        subs = new Set();
        this.keyedSubscriptions.set(k, subs);
      }

      subs.add(c);
    });

    return () => keys.forEach((k) => this.keyedSubscriptions.get(k)?.delete(c));
  }

  private gatherNotifications(changedKeys?: (keyof T)[]): Set<() => void> {
    const notifications = new Set(this.gatherIndiscriminateNotifications());
    if (changedKeys && this.keyedSubscriptions.size > 0) {
      this.gatherKeyedNotifications(changedKeys, notifications);
    }
    return notifications;
  }

  private gatherIndiscriminateNotifications() {
    return this.subscriptions;
  }

  private gatherKeyedNotifications(
    changedKeys: (keyof T)[],
    notifications: Set<() => void>
  ) {
    for (const key of changedKeys) {
      const subs = this.keyedSubscriptions.get(key);
      if (subs) {
        for (const c of subs) {
          notifications.add(c);
        }
      }
    }
  }
}
