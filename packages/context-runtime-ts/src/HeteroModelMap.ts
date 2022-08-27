import { SID_of } from '@strut/sid';
import { nullthrows } from '@strut/utils';
import { IModel } from './INode.js';

export default class ImmutableHeteroModelMap {
  protected map: Map<SID_of<IModel>, IModel | null> = new Map();

  get<T extends IModel<D>, D extends {}>(id: SID_of<T>): T | null {
    const ret = this.map.get(id);
    if (ret == null) {
      return null;
    }

    return ret as T;
  }

  getx<T extends IModel<D>, D extends {}>(id: SID_of<T>): T {
    return nullthrows(this.map.get(id)) as T;
  }
}

export class MutableHeteroModelMap extends ImmutableHeteroModelMap {
  set<T extends IModel<D>, D extends {}>(id: SID_of<T>, n: T | null): void {
    this.map.set(id, n);
  }
}
