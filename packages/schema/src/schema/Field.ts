import nullthrows from '../utils/nullthrows.js';
import FieldAndEdgeBase from './FieldAndEdgeBase.js';

export type FieldType = 'id' | 'boolean' | 'string' | 'map' | 'int';

export class Field<T extends FieldType> extends FieldAndEdgeBase {
  isRequired: boolean = true;

  constructor(public readonly type: T) {
    super();
  }

  required(v: boolean = true): this {
    this.isRequired = v;
    return this;
  }

  optional(v: boolean = true): this {
    return this.required(!v);
  }
}

class StringOfField extends Field<'string'> {
  constructor(private of: string) {
    super('string');
  }
}

export class MapField<K extends Field<'string'>, V extends Field<FieldType>>
  extends Field<'map'> {

  constructor(
    public readonly keyType: K,
    public readonly valueType: V,
  ) {
    super('map');
  }
}

export default {
  id: {
    guid(): Field<'id'> {
      return new Field('id');
    },

    int(): Field<'id'> {
      return new Field('id');
    }
  },

  bool(): Field<'boolean'> {
    return new Field('boolean');
  },

  stringOf(type: string): StringOfField {
    return new StringOfField(type);
  },

  map<K extends Field<'string'>, V extends Field<FieldType>>(
    keyType: K,
    valueType: V,
  ): MapField<K, V> {
    return new MapField(keyType, valueType);
  }
}
