import Schema from '../schema/Schema';
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
  }

  // TODO: this will differ based on the backend being targeted.
  // Or will it always be the same but the query will have different backends?
  private getEdgeCode(): string {
    return Object.entries(this.schema.getEdges())
      .map(([key, edge]) => {
`
  get${upcaseAt(key, 0)}(): ${edge.getQueryTypeName()} {
    return ${edge.getQueryTypeName()}.${edge.getQueryWithName()}(

    );
}
`
      }).join("\n");
  }
}

/*
class Type {
  // getters or raw fields for each field
  readonly id: guid;

  // queries for each edge

  // decratiors
}
*/
