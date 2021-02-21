import { Field, FieldType } from "../schema/Field";
import Schema from "../schema/Schema";
import assertUnreachable from "../utils/assertUnreachable";
import falsish from "../utils/falsish";
import AphroditeIntegration from "./AphroditeIntegration";

interface TypeGraphQLOptions {
  nullable: boolean,
  description: string,
}

class TypeGraphQL implements AphroditeIntegration {
  expose(fieldsOrEdges: string[]) {
    return this;
  }

  applyTo(schema: Schema): void {
    Object.entries(schema.getFields())
      .forEach(
        ([key, field]) => {
          field.decorator(this.createFieldDecorator(schema, field));
        },
      );
  }

  private createFieldDecorator(schema: Schema, field: Field<FieldType>) {
    // TODO: add imports to the schema.
    const options = {} as TypeGraphQLOptions;
    options.nullable = !field.isRequired;
    options.description = field.description;

    let optionsString = '';
    if (Object.values(options).filter(falsish).length > 0) {
      optionsString =
        `, {${options.nullable
            ? 'nullable: true,'
            : ''} ${options.description
              ? `description: '${options.description}'`
              : ''}}`;
    }

    const type = this.getGraphQLType(field);
    return `@Field(type => ${type}${optionsString})`;
  }

  private getGraphQLType(field: Field<FieldType>): string {
    switch (field.type) {
      case 'id':
        return 'ID';
      case 'boolean':
        return 'Boolean';
      case 'string':
        return 'String';
      case 'int':
        return 'Int';
      default:
        throw new Error(
          `${field.type} is not yet support by the TypeGraphQL integration`,
        );
    }
  }
}

export default function tgql() {
  return new TypeGraphQL();
}
