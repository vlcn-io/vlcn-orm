import { Field, FieldType } from './Field.js';
import { Edge, FieldEdge } from './Edge.js';
import stripSuffix from '../utils/stripSuffix.js';

export default abstract class Schema {
  protected abstract fields(): {[key:string]: Field<FieldType>};
  protected abstract edges(): {[key:string]: Edge};

  getFields(): {[key:string]: Field<FieldType>} {
    return this.fields();
  }

  getEdges(): {[key:string]: Edge} {
    const edges = this.edges();
    Object.entries(edges).forEach(
      ([key, edge]) => edge.name = key,
    );

    return edges;
  }

  getModelTypeName() {
    return stripSuffix(
      this.constructor.name,
      'Schema',
    ).expect('Schema names must end in "Schema"');
  }

  getMutatorTypeName() {
    return this.getModelTypeName() + 'Mutator';
  }

  getQueryTypeName() {
    return this.getModelTypeName() + 'Query';
  }
}
