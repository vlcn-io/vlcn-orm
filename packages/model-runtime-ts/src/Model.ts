import { Context, IModel, ModelCreate } from '@aphro/context-runtime-ts';
import { JunctionEdgeSpec, NodeSpec } from '@aphro/schema-api';
import { Disposer } from '@strut/events';
import { SID_of } from '@strut/sid';
import { typedKeys } from '@strut/utils';
import observe from './observe.js';

export default abstract class Model<T extends {}> implements IModel<T> {
  abstract readonly id: SID_of<this>;
  abstract readonly spec: ModelCreate<this, T> & (NodeSpec | JunctionEdgeSpec);

  readonly ctx: Context;
  protected data: T;

  private subscriptions: Set<() => void> = new Set();
  private keyedSubscriptions: Map<keyof T, Set<() => void>> = new Map();

  constructor(ctx: Context, data: T) {
    this.ctx = ctx;
    this.data = Object.freeze(data);
  }

  subscribe(c: () => void): Disposer {
    this.subscriptions.add(c);
    return () => this.subscriptions.delete(c);
  }

  get numObservers(): number {
    let keyedObservers = 0;
    for (const o of this.keyedSubscriptions.values()) {
      keyedObservers += o.size;
    }
    return this.subscriptions.size + keyedObservers;
  }

  subscribeTo(keys: (keyof T)[], c: () => void): Disposer {
    keys.forEach(k => {
      let subs = this.keyedSubscriptions.get(k);
      if (subs == null) {
        subs = new Set();
        this.keyedSubscriptions.set(k, subs);
      }

      subs.add(c);
    });

    return () => keys.forEach(k => this.keyedSubscriptions.get(k)?.delete(c));
  }

  generator(): Generator<Promise<this>> {
    return observe<this>(change => {
      // start the generator with an initial value
      change(this);
      return this.subscribe(() => change(this));
    });
  }

  generatorOn(keys: (keyof T)[]): Generator<Promise<this>> {
    return observe<this>(change => {
      change(this);
      return this.subscribeTo(keys, () => change(this));
    });
  }

  destroy() {
    this.subscriptions = new Set();
    this.keyedSubscriptions = new Map();
  }
  _get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  _d(): T {
    return this.data;
  }

  _merge(newData: Partial<T>): [Partial<T>, Set<() => void>] {
    const lastData = this.data;
    this.data = {
      ...this.data,
      ...newData,
    };

    let unchangedKeys = new Set();
    if (newData != null) {
      (Object.entries(newData) as [keyof Partial<T>, any][]).forEach(entry => {
        if (lastData[entry[0]] === entry[1]) {
          unchangedKeys.add(entry[0]);
        }
      });
    }

    const notifications = this.gatherNotifications(
      newData !== undefined
        ? unchangedKeys.size === 0
          ? typedKeys(newData)
          : typedKeys(newData).filter(k => !unchangedKeys.has(k))
        : undefined,
    );
    return [lastData, notifications];
  }

  _isNoop(updates: Partial<T>) {
    return (Object.entries(updates) as [keyof Partial<T>, any][]).every(
      entry => this.data[entry[0]] === entry[1],
    );
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

  private gatherKeyedNotifications(changedKeys: (keyof T)[], notifications: Set<() => void>) {
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

// export class PrivateEphemeralNode<T extends { id: SID_of<any> }> extends Model<T> {
//   get id(): SID_of<this> {
//     return this.data.id;
//   }

//   spec(): ModelCreate<this, T> & NodeSpec {
//     const self = this;
//     return {
//       type: 'node',
//       primaryKey: 'id',
//       createFrom(ctx: Context, data: T) {
//         self.
//       },
//     };
//   }
// }
