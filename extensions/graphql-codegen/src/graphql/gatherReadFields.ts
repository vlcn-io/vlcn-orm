import { GraphQL } from '@aphro/graphql-grammar';
import { Field, Node } from '@aphro/schema-api';

export function gatherReadFields(n: Node): Field[] {
  return (n.extensions.graphql?.read || []).map(fieldName => n.fields[fieldName]);
}
