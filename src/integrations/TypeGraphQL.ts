import { Field, FieldType } from "../schema/Field.js";
import { tsImport } from "../schema/ModuleConfig.js";
import Schema from "../schema/Schema.js";
import select from "../utils/select.js";
import AphroditeIntegration from "./AphroditeIntegration.js";

interface TypeGraphQLOptions {
  nullable: boolean,
  description: string,
}

class TypeGraphQL implements AphroditeIntegration {
  private fieldsOrEdges: string[] = [];

  expose(fieldsOrEdges: string[]) {
    this.fieldsOrEdges = fieldsOrEdges;
    return this;
  }

  applyTo(schema: Schema): void {
    select(this.fieldsOrEdges, schema.getFields())
      .forEach(
        (field) => {
          field?.decorator(this.createFieldDecorator(schema, field));
        },
      );

    schema
      .getConfig()
      .module
      .import(
        tsImport('{ Field, ObjectType, Int, Float }', null, 'type-graphql'),
      );

    schema.getConfig()
      .class
      .decorator(`@ObjectType({description: "${schema.getConfig().getDescription()}"})`)
  }

  private createFieldDecorator(schema: Schema, field: Field<FieldType>) {
    // TODO: add imports to the schema.
    const options = {} as TypeGraphQLOptions;
    options.nullable = !field.isRequired;
    options.description = field.description;

    let optionsString = '';
    if (Object.values(options).filter(x => !!x).length > 0) {
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
