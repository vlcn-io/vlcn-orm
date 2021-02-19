export type FieldType = 'guid' | 'bool' | 'string' | 'map' | 'int';

export class Field<T extends FieldType> extends FieldAndEdgeBase {
  isRequired: boolean = true;

  constructor(private type: T) {
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

class MapField<K extends Field<'string'>, V extends Field<FieldType>>
  extends Field<'map'> {

  constructor(
    private keyType: K,
    private valueType: V,
  ) {
    super('map');
  }
}

export default {
  guid(): Field<'guid'> {
    return new Field('guid');
  },

  bool(): Field<'bool'> {
    return new Field('bool');
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
