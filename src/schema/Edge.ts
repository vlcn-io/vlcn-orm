import Schema from './Schema';
import nullthrows from '../utils/nullthrows';

export type EdgeType = 'one_to_many' | 'one_to_one' | 'many_to_many' | 'many_to_one';

export class Edge<T extends EdgeType> extends FieldAndEdgeBase {
  private src?: Schema;

  constructor(
    private type: T,
    private dest: Schema,
  ) {
    super();
  }

  setSource(source: Schema) {
    this.src = source;
  }

  source(): Schema {
    return nullthrows(this.src);
  }
}

export default {
  oneToMany<T extends Schema>(otherSchema: { new(): T ;}): Edge<'one_to_many'> {
    return new Edge('one_to_many', new otherSchema());
  },

  oneToOne<T extends Schema>(otherSchema: { new(): T ;}): Edge<'one_to_one'> {
    return new Edge('one_to_one', new otherSchema());
  },

  manyToMany<T extends Schema>(otherSchema: { new(): T ;}): Edge<'many_to_many'> {
    return new Edge('many_to_many', new otherSchema());
  },

  manyToOne<T extends Schema>(otherSchema: { new(): T ;}): Edge<'many_to_one'> {
    return new Edge('many_to_one', new otherSchema());
  }
}
