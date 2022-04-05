import { nullthrows } from "@strut/utils";
import {
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  ID,
  Node,
} from "../parser/SchemaType.js";
import nodeFn from "./node.js";

export default {
  queryTypeName(
    node: Node,
    edge: EdgeDeclaration | EdgeReferenceDeclaration
  ): string {
    switch (edge.type) {
      case "edge":
        // The edge is either through or to the provided node type.
        // This could be:
        // Edge<Foo.barId>
        // or
        // Edge<Foo>
        if (edge.throughOrTo.type === node.name) {
          const column = edge.throughOrTo.column;
          if (column == null) {
            throw new Error(
              "Locally declared edge that is not _through_ something is currently unsupported"
            );
          }

          // Going through some id on ourself to some other thing (or even back to ourself)
          const throughField = node.fields[column];
          // if we're going _through_ a field, it must be an ID field.
          if (throughField.type !== "id") {
            throw new Error(
              `Cannot query through non-id field ${column} for edge ${edge.name} in node ${node.name}`
            );
          }

          return throughField.of + "Query";
        }

        // If we're here then we're through or to some other type that isn't our node type.
        return nodeFn.queryTypeName(edge.throughOrTo.type);
      case "edgeReference":
        return edge.name + "Query";
    }
  },

  destModelTypeName(
    src: Node,
    edge: EdgeDeclaration | EdgeReferenceDeclaration
  ): string {
    if (edge.type === "edgeReference") {
      throw new Error(
        "Edge references not yet supported. Need to do some condensing"
      );
    }

    const column = edge.throughOrTo.column;
    if (column == null) {
      return edge.throughOrTo.type;
    }

    if (edge.throughOrTo.type !== src.name) {
      return edge.throughOrTo.type;
    }

    const field = src.fields[column];
    if (field.type != "id") {
      throw new Error(
        `Cannot query through non-id field ${column} for edge ${edge.name} in node ${src.name}`
      );
    }

    return field.of;
  },

  isThrough(edge: EdgeDeclaration): boolean {
    return edge.throughOrTo.column != null;
  },

  isTo(edge: EdgeDeclaration): boolean {
    return edge.throughOrTo.column == null;
  },

  isThroughNode(node: Node, edge: EdgeDeclaration): boolean {
    return (
      edge.throughOrTo.type === node.name && edge.throughOrTo.column != null
    );
  },

  isForeignKeyEdge(node: Node, edge: EdgeDeclaration): boolean {
    // TODO: technically we should be able to verify that the column does indeed point back to
    // Node type.
    return (
      edge.throughOrTo.type !== node.name && edge.throughOrTo.column != null
    );
  },

  idField(node: Node, edge: EdgeDeclaration): ID {
    const field = node.fields[nullthrows(edge.throughOrTo.column)];
    if (field.type === "id") {
      return field;
    }

    throw new Error(
      `Edge ${edge.name} did not map ${edge.throughOrTo.type}:${edge.throughOrTo.column} to an id field. Got ${field.type}`
    );
  },
};
