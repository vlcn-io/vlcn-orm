import { Field, FieldType } from './Field';
import { Edge, EdgeType } from './Edge';

export default abstract class Schema {
  protected abstract fields(): {[key:string]: Field<FieldType>};
  protected abstract edges(): {[key:string]: Edge<EdgeType>};

  getFields(): {[key:string]: Field<FieldType>} {
    return this.fields();
  }

  getEdges(): {[key:string]: Edge<EdgeType>} {
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
