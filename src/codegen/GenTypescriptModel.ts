import Schema from '../schema/Schema';
import { Edge, ForeignKeyEdge } from '../schema/Edge.js';
import upcaseAt from '../utils/upcaseAt.js';
import CodegenStep from './CodegenStep.js';
import isValidPropertyAccessor from '../utils/isValidPropertyAccessor.js';
import { fieldToTsType } from './tsUtils.js';

export default class GenTypescriptModel extends CodegenStep {
  constructor(private schema: Schema) {
    super();
  }

  gen(): string {
    return `
class ${this.schema.getModelTypeName()}
  extends Model<${this.getDataShape()}> {
  ${this.getFieldCode()}
  ${this.getEdgeCode()}
}
`;
  }

  private getDataShape(): string {
    const props = Object.entries(this.schema.getFields())
      .map(
        ([key, field]) =>
          `${isValidPropertyAccessor(key) ? key : `'${key}'`}: ${fieldToTsType(field)}`,
      );
    return `{
  ${props.join(",\n  ")}
}`;
  }

  private getFieldCode(): string {
    return Object.entries(this.schema.getFields())
      .map(([key, field]) =>
        `
  ${field.decorators.join("\n  ")}
  get${upcaseAt(key, 0)}(): ${fieldToTsType(field)} {
    return this.data${isValidPropertyAccessor(key) ? `.${key}` : `['${key}']`};
  }
`
      ).join("\n");
  }

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
