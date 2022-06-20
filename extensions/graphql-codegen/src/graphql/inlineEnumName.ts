import { SchemaNode, Enum } from '@aphro/schema-api';
import { upcaseAt } from '@strut/utils';

export function inlineEnumName(n: SchemaNode, f: Enum): string {
  return 'Enum' + n.name + upcaseAt(f.name, 0);
}
