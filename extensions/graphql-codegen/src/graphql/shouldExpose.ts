import { Node } from '@aphro/schema-api';

export default function shouldExpose(n: Node): boolean {
  return (
    n.extensions.graphql != null &&
    (n.extensions.graphql.read.length > 0 || n.extensions.graphql.write.length > 0)
  );
}
