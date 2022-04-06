import { nullthrows, upcaseAt } from "@strut/utils";
import { CodegenFile } from "../CodegenFile.js";
import CodegenStep from "../CodegenStep.js";
import TypescriptFile from "./TypescriptFile.js";
import {
  Field,
  Node,
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  ID,
} from "../../schema/parser/SchemaType.js";
import nodeFn from "../../schema/v2/node.js";
import edgeFn from "../../schema/v2/edge.js";

export default class GenTypescriptQuery extends CodegenStep {
  // This can technicall take a node _or_ an edge.
  // also... should we have access to the entire schema file?
  static accepts(_schema: Node): boolean {
    return true;
  }

  constructor(private schema: Node) {
    super();
  }

  // Nit:
  // we can technically return an array of files.
  // Since we can have edge data... so we'd need edge queries rather than a query per schema.
  // b/c structure on the edges...
  // TODO: de-duplicate imports by storing imports in an intermediate structure.
  gen(): CodegenFile {
    return new TypescriptFile(
      nodeFn.queryTypeName(this.schema.name) + ".ts",
      `import {DerivedQuery} from '@strut/model/query/Query.js';
import QueryFactory from '@strut/model/query/QueryFactory.js';
import {modelLoad, filter} from '@strut/model/query/Expression.js';
import {Predicate, default as P} from '@strut/model/query/Predicate.js';
import {ModelFieldGetter} from '@strut/model/query/Field.js';
import { SID_of } from '@strut/sid';
import ${this.schema.name}, { Data, spec } from './${this.schema.name}.js';
${this.getIdFieldImports()}
${this.getEdgeImports()}

export default class ${nodeFn.queryTypeName(
        this.schema.name
      )} extends DerivedQuery<${this.schema.name}> {
  static create() {
    return new ${nodeFn.queryTypeName(this.schema.name)}(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom),
    );
  }
  ${this.getFromIdMethodCode()}
  ${this.getFromInboundFieldEdgeMethodsCode()}

  ${this.getFilterMethodsCode()}
  ${this.getHopMethodsCode()}
}
`
    );
  }

  private getFilterMethodsCode(): string {
    const ret: string[] = [];
    const fields = Object.values(this.schema.fields);
    for (const field of fields) {
      ret.push(`
      where${upcaseAt(field.name, 0)}(p: Predicate<Data["${field.name}"]>) {
        ${this.getFilterMethodBody(field)}
      }`);
    }
    return ret.join("\n");
  }

  private getFilterMethodBody(field: Field): string {
    return `return new ${nodeFn.queryTypeName(this.schema.name)}(
      this,
      filter(
        new ModelFieldGetter<"${field.name}", Data, ${this.schema.name}>("${
      field.name
    }"),
        p,
      ), 
    )`;
  }

  private getFromIdMethodCode(): string {
    return `
static fromId(id: SID_of<${this.schema.name}>) {
  return this.create().whereId(P.equals(id));
}
`;
  }

  private getFromInboundFieldEdgeMethodsCode(): string {
    // this would be inbound edges, right?
    // inbound edges to me based on one of my fields.
    const inbound: EdgeDeclaration[] = Object.values(
      this.schema.extensions.inboundEdges?.edges || {}
    )
      .filter((edge) => edge.type === "edge")
      .filter((edge: EdgeDeclaration) =>
        edgeFn.isThroughNode(this.schema, edge)
      ) as EdgeDeclaration[];

    return inbound.map(this.getFromInboundFieldEdgeMethodCode).join("\n");
  }

  private getFromInboundFieldEdgeMethodCode(edge: EdgeDeclaration): string {
    const column = nullthrows(edge.throughOrTo.column);
    const field = this.schema.fields[column];

    if (field.type !== "id") {
      throw new Error("fields edges must refer to id fields");
    }

    return `
static from${upcaseAt(column, 0)}(id: SID_of<${field.of}>) {
  return this.create().where${upcaseAt(field.name, 0)}(P.equals(id));
}
`;
  }

  private getEdgeImports(): string {
    const inbound = Object.values(
      this.schema.extensions.inboundEdges?.edges || {}
    ).filter((e) => e.type === "edge") as EdgeDeclaration[];

    const outbound = Object.values(
      this.schema.extensions.outboundEdges?.edges || {}
    ).filter((e) => e.type === "edge") as EdgeDeclaration[];

    return [...inbound, ...outbound]
      .filter(
        (edge) =>
          edgeFn.queryTypeName(this.schema, edge) !==
          nodeFn.queryTypeName(this.schema.name)
      )
      .map((edge) => {
        return `import {spec as ${edgeFn.destModelTypeName(
          this.schema,
          edge
        )}Spec} from "./${edgeFn.destModelTypeName(this.schema, edge)}"
        import ${edgeFn.queryTypeName(
          this.schema,
          edge
        )} from "./${edgeFn.queryTypeName(this.schema, edge)}"`;
      })
      .join("\n");

    // import edge reference queries too
  }

  private getIdFieldImports(): string {
    // TODO: fix all these cases on filter(s)
    const idFields = Object.values(this.schema.fields).filter(
      (f) => f.type === "id"
    ) as ID[];

    return idFields.map((f) => `import ${f.of} from "./${f.of}.js"`).join("\n");
  }

  private getHopMethodsCode(): string {
    // hop methods are edges
    // e.g., Deck.querySlides().queryComponents()
    const outbound = Object.values(
      this.schema.extensions.outboundEdges?.edges || {}
    );
    return outbound.map((e) => this.getHopMethod(e)).join("\n");
  }

  private getHopMethod(
    edge: EdgeDeclaration | EdgeReferenceDeclaration
  ): string {
    if (edge.type === "edgeReference") {
      throw new Error("Edge references not yet supported...");
    }

    let body = "";
    if (edgeFn.isTo(edge)) {
      body = this.getHopMethodForJunctionLikeEdge(edge);
    } else {
      body = this.getHopMethodForFieldLikeEdge(edge);
    }

    return `query${upcaseAt(edge.name, 0)}(): ${edgeFn.queryTypeName(
      this.schema,
      edge
    )} {
      ${body}
    }`;
  }

  private getHopMethodForJunctionLikeEdge(edge: EdgeDeclaration): string {
    return "";
  }

  private getHopMethodForFieldLikeEdge(edge: EdgeDeclaration): string {
    let hopOperation = "";
    // are we through a field on our own type?
    if (edgeFn.isThroughNode(this.schema, edge)) {
      hopOperation = `whereId(P.equals(this.${edge.throughOrTo.column}))`;
    } else {
      // we are through a field on the dest node.
      hopOperation = `where${upcaseAt(
        nullthrows(edge.throughOrTo.column),
        0
      )}(P.equals(this.id))`;
    }

    return `return new ${edgeFn.queryTypeName(
      this.schema,
      edge
    )}(QueryFactory.createHopQueryFor(this, spec, ${edgeFn.destModelTypeName(
      this.schema,
      edge
    )}Spec),
      modelLoad(${edgeFn.destModelTypeName(this.schema, edge)}Spec.createFrom),
      ).${hopOperation};`;
  }
}

/*
Codegening the query shouldn't care what the underlying storage impl is.
Query layer is storage agnostic.

Thus we should use the `schema` to call into a `factory` which will construct the
`source query` / `source expression` based on the underlying storage type.
*/

/*
Derived query example:
SlideQuery extends DerivedQuery {
  static create() {
    return new SlideQuery(
      Factory.createSourceQueryFor(schema) // e.g., new SQLSourceQuery(schema),
      // convert raw db result into model load.
      // we'd want to move this expression to the end in plan optimizaiton.
      new ModelLoadExpression(Slide.createFromData)
    );
  }

  whereName(predicate: Predicate) {
    return new SlideQuery(
      this, // the prior query
      new ModelFilterExpression(field, predicate)
    );
  }
}
*/
