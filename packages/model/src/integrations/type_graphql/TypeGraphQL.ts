import { select } from "@strut/utils";
import AphroditeIntegration from "../AphroditeIntegration.js";
import { Node, Field } from "../../schema/parser/SchemaType.js";
import nodeFn from "../../schema/v2/node.js";
import fieldFn from "../../schema/v2/field.js";
import { tsImport } from "../../schema/v2/module.js";

interface TypeGraphQLOptions {
  nullable: boolean;
  description: string;
}

// TODO: integrations should be able to contribute validation steps too!
export class TypeGraphQL implements AphroditeIntegration {
  private fieldsOrEdges: string[] = [];

  expose(fieldsOrEdges: string[]) {
    this.fieldsOrEdges = fieldsOrEdges;
    return this;
  }

  applyTo(schema: Node): void {
    // TODO: need to be able to expose edges too. That's missing here.
    select(this.fieldsOrEdges, schema.fields).forEach((field) =>
      fieldFn.decorate(field, this.createFieldDecorator(schema, field))
    );

    nodeFn.addModuleImport(
      schema,
      tsImport("{ Field, ObjectType, Int, Float, ID }", null, "type-graphql")
    );
    nodeFn.addModuleImport(schema, tsImport(null, null, "reflect-metadata"));

    nodeFn.decorateType(
      schema,
      `@ObjectType({description: ""})` // ${schema.description}
    );
  }

  private createFieldDecorator(schema: Node, field: Field) {
    // TODO: add imports to the schema.
    const options = {} as TypeGraphQLOptions;
    options.nullable = !field.isRequired;
    options.description = field.description || "";

    let optionsString = "";
    if (Object.values(options).filter((x) => !!x).length > 0) {
      optionsString = `, {${options.nullable ? "nullable: true," : ""} ${
        options.description ? `description: '${options.description}'` : ""
      }}`;
    }

    const type = this.getGraphQLType(field);
    return `@Field(_ => ${type}${optionsString})`;
  }

  private getGraphQLType(field: Field): string {
    switch (field.type) {
      case "id":
        return "ID";
      case "primitive":
        switch (field.subtype) {
          case "bool":
            return "Boolean";
          case "float32":
          case "float64":
            return "Float";
          case "int32":
          case "int64":
          case "uint32":
          case "uint64":
            // TODO: does typegraphql convert > 53 bit ints to strings for js?
            return "Int";
          case "string":
            return "String";
        }
      default:
        throw new Error(
          `${field.type} is not yet support by the TypeGraphQL integration`
        );
    }
  }
}

export default function tgql() {
  return new TypeGraphQL();
}
