import { invariant, nullthrows } from '@strut/utils';
import {
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  ID,
  Node,
  EdgeType,
  Field,
  Edge,
  StorageConfig,
} from '@aphro/schema-api';
import nodeFn from './node.js';

const funcs = {
  queryTypeName(node: Node, edge: EdgeDeclaration | Edge): string {
    switch (edge.type) {
      case 'edge':
        // The edge is either through or to the provided node type.
        // This could be:
        // Edge<Foo.barId>
        // or
        // Edge<Foo>
        if (edge.throughOrTo.type === node.name) {
          const column = edge.throughOrTo.column;
          if (column == null) {
            throw new Error(
              `Locally declared edge (${JSON.stringify(
                edge,
              )}) that is not _through_ something is currently unsupported`,
            );
          }

          // Going through some id on ourself to some other thing (or even back to ourself)
          const throughField = node.fields[column];
          // if we're going _through_ a field, it must be an ID field.
          if (throughField.type !== 'id') {
            throw new Error(
              `Cannot query through non-id field ${column} for edge ${edge.name} in node ${node.name}`,
            );
          }

          return throughField.of + 'Query';
        }

        // If we're here then we're through or to some other type that isn't our node type.
        return nodeFn.queryTypeName(edge.throughOrTo.type);
      case 'standaloneEdge':
        return edge.dest.type + 'Query';
      // return edge.name + 'Query';
    }
  },

  destModelTypeName(src: Node, edge: EdgeDeclaration | Edge): string {
    if (edge.type === 'standaloneEdge') {
      return edge.dest.type;
    }

    const column = edge.throughOrTo.column;
    if (column == null) {
      return edge.throughOrTo.type;
    }

    if (edge.throughOrTo.type !== src.name) {
      return edge.throughOrTo.type;
    }

    const field = src.fields[column];
    if (field.type != 'id') {
      throw new Error(
        `Cannot query through non-id field ${column} for edge ${edge.name} in node ${src.name}`,
      );
    }

    return field.of;
  },

  destModelSpecName(src: Node, edge: EdgeDeclaration | Edge): string {
    return nodeFn.specName(funcs.destModelTypeName(src, edge));
  },

  isThrough(edge: EdgeDeclaration): boolean {
    return edge.throughOrTo.column != null;
  },

  isTo(edge: EdgeDeclaration): boolean {
    return edge.throughOrTo.column == null;
  },

  isThroughNode(node: Node, edge: EdgeDeclaration): boolean {
    return edge.throughOrTo.type === node.name && edge.throughOrTo.column != null;
  },

  isForeignKeyEdge(node: Node, edge: EdgeDeclaration): boolean {
    // TODO: technically we should be able to verify that the column does indeed point back to
    // Node type.
    return edge.throughOrTo.type !== node.name && edge.throughOrTo.column != null;
  },

  outboundEdgeType(node: Node, edge: EdgeDeclaration | Edge): EdgeType {
    // What if we're a foreign key to ourselves?
    // Foo.fooId as field edge is to one foo.
    // Foo.fooId as foreign key is Foo tot many foos
    // We'd need more info to know if foreign key to self or not.
    //
    // other options:
    // Type is self.
    // column exists and is not primary key.
    // -> Field edge.
    //
    // Type is self.
    // column does not exist or is priamry key.
    // -> Junction edge
    //
    // Type is not self.
    // column exists and is not primary key.
    // -> foreign key
    //
    // Type is not self.
    // column does not exist or is primary key
    // -> Junction edge
    if (edge.type === 'standaloneEdge') {
      return 'junction';
    }

    const column = edge.throughOrTo.column;

    if (edge.throughOrTo.type === node.name) {
      if (column != null) {
        return 'field';
      }

      return 'junction';
    }

    if (column != null) {
      return 'foreignKey';
    }

    return 'junction';
  },

  outboundEdgeSourceField(src: Node, edge: EdgeDeclaration | Edge): Field {
    const type = funcs.outboundEdgeType(src, edge);
    switch (type) {
      case 'junction':
        return nodeFn.primaryKey(src);
      case 'field':
        if (edge.type === 'standaloneEdge') {
          throw new Error(
            `Standalone edge definitions cannot be field edges. Edge: ${edge.name}, Node: ${src.name}`,
          );
        }
        return src.fields[nullthrows(edge.throughOrTo.column)];
      case 'foreignKey':
        if (edge.type === 'standaloneEdge') {
          throw new Error(
            `Standalone edge definitions cannot be foreign key edges. Edge: ${edge.name}, Node: ${src.name}`,
          );
        }
        return nodeFn.primaryKey(src);
    }
  },

  outboundEdgeDestFieldName(src: Node, edge: EdgeDeclaration | Edge): string {
    const type = funcs.outboundEdgeType(src, edge);
    // TODO: we need access to the destination definitions if we're
    // to look up primary keys.
    // Or the user must explicitly provide this info in their schema definition
    switch (type) {
      case 'field':
        return 'id';
      case 'junction':
        return 'id';
      case 'foreignKey':
        if (edge.type === 'standaloneEdge') {
          throw new Error(
            `Standalone edge definitions cannot be foreign key edges. Edge: ${edge.name}, Node: ${src.name}`,
          );
        }
        return nullthrows(edge.throughOrTo.column);
    }
  },

  idField(node: Node, edge: EdgeDeclaration): ID {
    const field = node.fields[nullthrows(edge.throughOrTo.column)];
    if (field.type === 'id') {
      return field;
    }

    throw new Error(
      `Edge ${edge.name} did not map ${edge.throughOrTo.type}:${edge.throughOrTo.column} to an id field. Got ${field.type}`,
    );
  },

  dereference(
    e: EdgeDeclaration | EdgeReferenceDeclaration,
    edges: { [key: string]: Edge },
  ): EdgeDeclaration | Edge {
    if (e.type === 'edgeReference') {
      return edges[e.reference];
    }

    return e;
  },

  storageConfig(e: EdgeDeclaration | Edge): StorageConfig {
    if (e.type === 'edge') {
      throw new Error(
        'Standalone storage for edge declarations not yet supported. Use a standalone edge and edge reference for ' +
          e.name,
      );
    }

    return e.storage;
  },
};

export default funcs;
