import Schema from '../schema/Schema';
import { Edge, ForeignKeyEdge } from '../schema/Edge.js';
import upcaseAt from '../utils/upcaseAt.js';
import CodegenStep from './CodegenStep.js';
import isValidPropertyAccessor from '../utils/isValidPropertyAccessor.js';

export default class GenTypescriptModel extends CodegenStep {
  constructor(private schema: Schema) {
    super();
  }

  gen(): string {
    return `
class ${this.schema.getModelTypeName()} {
  ${this.getFieldCode()}
  ${this.getEdgeCode()}
}
`;
  }

  private getFieldCode(): string {
    return Object.entries(this.schema.getFields())
      .map(([key, field]) =>
`
  get${upcaseAt(key, 0)}(): ${field.getTSReturnType()} {
    return this.data${isValidPropertyAccessor(key) ? `.${key}` : `['${key}']`};
  }
`
      ).join("\n");

    // TODO: add field edge fields too!
  }

  // TODO: this will differ based on the backend being targeted.
  // Or will it always be the same but the query will have different backends?
  private getEdgeCode(): string {
    return Object.entries(this.schema.getEdges())
      .map(([key, edge]) =>
`
  query${upcaseAt(key, 0)}(): ${edge.getQueryTypeName()} {
    return ${edge.getQueryTypeName()}.${this.getFromMethodName(edge)}(
      ${this.getIdGetter(key, edge)}
    );
}
`
      ).join("\n");
  }

  private getFromMethodName(edge: Edge): string {
    if (edge instanceof ForeignKeyEdge) {
      return 'fromForeignId';
    }
    // Junction edges could be foreign id depending on what side of the junction we are
    return 'fromId';
  }

  private getIdGetter(key, edge: Edge): string {
    if (edge instanceof ForeignKeyEdge) {
      return `this.getId(), '${edge.inverse.name}'`;
    } else {
      return `this.get${upcaseAt(key, 0)}Id()`;
    }
  }
}
