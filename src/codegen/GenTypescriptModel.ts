import Schema from '../schema/Schema';
import { Edge } from '../schema/Edge.js';
import upcaseAt from '../utils/upcaseAt.js';
import CodegenStep from './CodegenStep.js';

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
    return this.data['${key}'];
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
  get${upcaseAt(key, 0)}(): ${edge.getQueryTypeName()} {
    return ${edge.getQueryTypeName()}.${this.getFromMethodName(edge)}(
      ${this.getIdGetter(key, edge)}
    );
}
`
      ).join("\n");
  }

  private getFromMethodName(edge: Edge): string {
    switch (edge.queriesWith()) {
      case 'foreign_id':
        return 'fromForeignId';
      case 'id':
        return 'fromId';
    }
  }

  private getIdGetter(key, edge: Edge): string {
    switch (edge.queriesWith()) {
      case 'foreign_id':
        return `this.getId(), ${edge.getDest().getFieldEdgeTo(this.schema)}`;
      case 'id':
        return `id: this.get${upcaseAt(key, 0)}Id()`;
    }
  }
}
