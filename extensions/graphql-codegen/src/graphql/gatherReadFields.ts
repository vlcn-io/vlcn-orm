import { GraphQL } from '@aphro/graphql-grammar';
import { Edge, EdgeDeclaration, EdgeReferenceDeclaration, Field, Node } from '@aphro/schema-api';

export function gatherReadFields(n: Node): Field[] {
  return (n.extensions.graphql?.read || [])
    .map(fieldName => n.fields[fieldName])
    .filter(f => f != null);
}

export function gatherReadEdges(n: Node): (EdgeDeclaration | EdgeReferenceDeclaration)[] {
  const edges = n.extensions.outboundEdges?.edges;
  if (edges == null) {
    return [];
  }

  return (n.extensions.graphql?.read || [])
    .map(fieldName => edges[fieldName])
    .filter(f => f != null);
}
