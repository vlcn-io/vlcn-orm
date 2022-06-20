import { SchemaNode } from '@aphro/schema-api';

export default function shouldExpose(n: SchemaNode): boolean {
  return (
    n.extensions.graphql != null &&
    (n.extensions.graphql.read?.length > 0 || n.extensions.graphql.write?.length > 0)
  );
}

export function exposesRoot(n: SchemaNode): boolean {
  return shouldExpose(n) && n.extensions?.graphql?.root != null;
}
