import Schema from './Schema';
import nullthrows from '../utils/nullthrows';

export type EdgeType = 'one_to_many' | 'one_to_one' | 'many_to_many' | 'many_to_one';
export type QueriesWith = 'id' | 'foreign_id';

export abstract class Edge extends FieldAndEdgeBase {
  private src?: Schema;
  private uniq: boolean = false;

  constructor(
    private readonly type: EdgeType,
    private readonly dest: Schema,
  ) {
    super();
  }

  setSource(source: Schema) {
    this.src = source;
  }

  getDest(): Schema {
    return this.dest;
  }

  getSource(): Schema {
    return nullthrows(this.src);
  }

  getQueryTypeName(): string {
    // TODO: this won't always be the case.
    // Some query types will vary based on source schema as well or
    // presesnce of edge data.
    return this.dest.getQueryTypeName();
  }

  abstract queriesWith(): QueriesWith;
}

class FieldEdge extends Edge {
  constructor(
    type: 'one_to_one' | 'many_to_one',
    dest: Schema
  ) {
    super(type, dest);
  }

  queriesWith(): QueriesWith {
    return 'id';
  }
}

class JunctionEdge extends Edge {
  constructor(
    type: EdgeType,
    dest: Schema
  ) {
    super(type, dest);
  }

  queriesWith(): QueriesWith {
    return 'id';
  }

  getQueryTypeName(): string {
    return this.getSource().getModelTypeName()
      + this.getDest().getModelTypeName()
      + 'JunctionEdgeQuery';
  }
}

class ForeignKeyEdge extends Edge {
  constructor(
    type: 'one_to_many' | 'one_to_one',
    dest: Schema
  ) {
    super(type, dest);
  }

  // TODO: should this go into codegen code instead?
  // but nice to have colocated with the field.
  queriesWith(): QueriesWith {
    return 'foreign_id';
  }
}

export default {
  field<T extends Schema>(
    type: 'one_to_one' | 'many_to_one',
    otherSchema: { new(): T ;},
  ): Edge {
    return new FieldEdge(type, new otherSchema());
  },

  foreignKey<T extends Schema>(
    type: 'one_to_many' | 'one_to_one',
    otherSchema: { new(): T ;},
  ): ForeignKeyEdge {
    return new ForeignKeyEdge(type, new otherSchema());
  },

  junction<T extends Schema>(type: EdgeType, otherSchema: { new(): T ;}): JunctionEdge {
    return new JunctionEdge(type, new otherSchema());
  },
}
