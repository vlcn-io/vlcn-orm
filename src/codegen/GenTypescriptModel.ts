import Schema from '../schema/Schema';
import { Edge } from '../schema/Edge';
import upcaseAt from '../utils/upcaseAt';

export default class GenTypescriptModel {
  constructor(private schema: Schema) {}

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
      .map(([key, field]) => {
`
  get${upcaseAt(key, 0)}(): ${field.getTSReturnType()} {
    return this.data[key];
  }
`
      }).join("\n");

    // TODO: add field edge fields too!
  }

  // TODO: this will differ based on the backend being targeted.
  // Or will it always be the same but the query will have different backends?
  private getEdgeCode(): string {
    return Object.entries(this.schema.getEdges())
      .map(([key, edge]) => {
`
  get${upcaseAt(key, 0)}(): ${edge.getQueryTypeName()} {
    return ${edge.getQueryTypeName()}.${this.getFromMethodName(edge)}(
      ${this.getIdGetter(key, edge)}
    );
}
`
      }).join("\n");
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
        return `{ from_id: this.getId(), from_type: ${this.schema.getModelTypeName()} }`;
      case 'id':
        return `{ to_id: this.get${upcaseAt(key, 0)}Id(), from_type: ${this.schema.getModelTypeName()} }`;
    }
  }
}
