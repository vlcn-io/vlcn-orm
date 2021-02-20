import { Field, FieldType } from './Field.js';
import { Edge, EdgeType } from './Edge.js';

export default abstract class Schema {
  protected abstract fields(): {[key:string]: Field<FieldType>};
  protected abstract edges(): {[key:string]: Edge};

  getFields(): {[key:string]: Field<FieldType>} {
    return this.fields();
  }

  getEdges(): {[key:string]: Edge} {
    return this.edges();
  }

  getModelTypeName() {
    return this.constructor.name;
  }

  getMutatorTypeName() {
    return this.getModelTypeName() + 'Mutator';
  }

  getQueryTypeName() {
    return this.getModelTypeName() + 'Query';
  }
}
