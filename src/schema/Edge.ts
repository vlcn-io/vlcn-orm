import Schema from './Schema.js';
import nullthrows from '../utils/nullthrows.js';
import FieldAndEdgeBase from './FieldAndEdgeBase.js';
import { Field } from './Field.js';

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
}

export class FieldEdge extends Edge {
  constructor(
    type: 'one_to_one' | 'many_to_one',
    dest: Schema
  ) {
    super(type, dest);
  }
}

export class JunctionEdge extends Edge {
  constructor(
    type: EdgeType,
    dest: Schema
  ) {
    super(type, dest);
  }

  getQueryTypeName(): string {
    return this.getSource().getModelTypeName()
      + this.getDest().getModelTypeName()
      + 'JunctionEdgeQuery';
  }
}

export class ForeignKeyEdge extends Edge {
  constructor(
    type: 'one_to_many' | 'one_to_one',
    dest: Schema
  ) {
    super(type, dest);
  }

  getField(): Field<'id'> {
    throw new Error('unimplemented');
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
