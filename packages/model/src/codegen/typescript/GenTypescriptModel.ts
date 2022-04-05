import { asPropertyAccessor, upcaseAt } from "@strut/utils";
import CodegenStep from "../CodegenStep.js";
import { fieldToTsType } from "./tsUtils.js";
import { CodegenFile } from "../CodegenFile.js";
import TypescriptFile from "./TypescriptFile.js";
import {
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  Node,
} from "../../schema/parser/SchemaType.js";
import nodeFn from "../../schema/v2/node.js";
import edgeFn from "../../schema/v2/edge.js";

export default class GenTypescriptModel extends CodegenStep {
  static accepts(_schema: Node): boolean {
    return true;
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new TypescriptFile(
      this.schema.name + ".ts",
      `import Model, {Spec} from '@strut/model/Model.js';
import {SID_of} from '@strut/sid';
${this.getImportCode()}

export type Data = ${this.getDataShapeCode()};

${this.schema.extensions.type?.decorators?.join("\n") || ""}
export default class ${this.schema.name}
  extends Model<Data> {
  ${this.getFieldCode()}
  ${this.getEdgeCode()}
}

${this.getSpecCode()}
`
    );
  }

  private getDataShapeCode(): string {
    const fieldProps = Object.values(this.schema.fields).map(
      (field) => `${asPropertyAccessor(field.name)}: ${fieldToTsType(field)}`
    );
    return `{
  ${fieldProps.join(",\n  ")}
}`;
  }

  private getImportCode(): string {
    const ret: string[] = [];
    for (const val of this.schema.extensions.module?.imports.values() || []) {
      const name = val.name != null ? val.name + " " : "";
      const as = val.as != null ? "as " + val.as + " " : "";
      if (name === "") {
        ret.push(`import "${val.from}";`);
      } else {
        ret.push(`import ${name}${as}from '${val.from}';`);
      }
    }
    for (const edge of nodeFn.allEdges(this.schema)) {
      ret.push(
        `import ${edgeFn.queryTypeName(
          this.schema,
          edge
        )} from "./${edgeFn.queryTypeName(this.schema, edge)}.js"`
      );
      if (edge.type === "edge") {
        if (edge.throughOrTo.type !== this.schema.name) {
          ret.push(
            `import ${edge.throughOrTo.type} from "./${edge.throughOrTo.type}.js"`
          );
        }
      }
    }
    return ret.join("\n");
  }

  private getFieldCode(): string {
    return Object.values(this.schema.fields)
      .map(
        (field) =>
          `${field.decorators?.join("\n") || ""}
      get ${field.name}(): ${fieldToTsType(field)} {
        return this.data.${field.name};
      }
    `
      )
      .join("\n");
  }

  private getEdgeCode(): string {
    /*
    outbound edges
    - through a field on self: field edge
    - to self type: should have been a junction edge?
      - not yet supported, ask user to declare a standalone junction
      - could be an edge stored in a different system or a junction edge.
    - through a field on other: foreign key edge
    - to a other type: should have been a junction edge?
      - not yet supported, ask user to declare a standalone edge
      - could be an edge stored in a different system or a junction edge.

    inbound edges:
    - through a field on self
      - foreign key
    - through a field on other
      - foreign key
    - from self
      - see outbound `to self type`
    - from other type
      - see outbound `to other type`
    */

    return Object.values(this.schema.extensions.outboundEdges?.edges || {})
      .map(
        (edge) => `query${upcaseAt(edge.name, 0)}(): ${edgeFn.queryTypeName(
          this.schema,
          edge
        )} {
          return ${edgeFn.queryTypeName(
            this.schema,
            edge
          )}.${this.getFromMethodInvocation("outbound", edge)};
        }`
      )
      .join("\n");

    // TODO: static inbound edge defs
  }

  private getSpecCode(): string {
    return `
    export const spec: Spec<Data> = {
      createFrom(data: Data) {
        return new ${this.schema.name}(data);
      },

      storageDescriptor: {
        engine: "${this.schema.storage.engine}",
        db: "${this.schema.storage.db}",
        type: "${this.schema.storage.type}",
        tablish: "${this.schema.storage.table}",
      },
    }
    `;
  }

  // inbound edges would be static methods
  private getFromMethodInvocation(
    type: "inbound" | "outbound",
    edge: EdgeDeclaration | EdgeReferenceDeclaration
  ): string {
    if (type === "inbound") {
      throw new Error("inbound edge generation on models not yet supported");
    }

    // outbound edge through a field would be:
    // outbound foreign key would be: BarQuery.fromFooId(this.id); // Foo | OB { Edge<Bar.fooId> }
    // outbound field edge would be: BarQuery.fromId(this.barId); // Foo | OB { Edge<Foo.barId> }

    switch (edge.type) {
      case "edge":
        const column = edge.throughOrTo.column;
        if (column == null) {
          // this error should already have been thrown earlier.
          throw new Error(
            "Locally declared edge that is not _through_ something is currently unsupported"
          );
        }

        // through a field on self is a field edge
        // a field edge refers to the id of the destination type.
        if (edge.throughOrTo.type === this.schema.name) {
          return `fromId(this.${column})`;
        }

        // through a field on some other type is a foreign key edge
        // we're thus qurying that type based on some column rather than its id
        return `from${upcaseAt(column, 0)}(this.id)`;
      case "edgeReference":
        // if (edge.inverted) {
        //   return "fromDst";
        // }
        return "fromSrc(this.id)";
    }
  }
}
