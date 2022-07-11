import { GraphQL } from '@aphro/graphql-grammar';
import {
  SchemaEdge,
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  Field,
  SchemaNode,
  FieldDeclaration,
} from '@aphro/schema-api';

export function gatherReadFields(n: SchemaNode): FieldDeclaration[] {
  return (n.extensions.graphql?.read || [])
    .map(fieldName => n.fields[fieldName])
    .filter(f => f != null);
}

export function gatherReadEdges(n: SchemaNode): (EdgeDeclaration | EdgeReferenceDeclaration)[] {
  const edges = n.extensions.outboundEdges?.edges;
  if (edges == null) {
    return [];
  }

  return (n.extensions.graphql?.read || [])
    .map(fieldName => edges[fieldName])
    .filter(f => f != null);
}
