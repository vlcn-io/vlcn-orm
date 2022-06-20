import {
  SchemaEdge,
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  SchemaNode,
} from '@aphro/schema-api';
import { upcaseAt } from '@strut/utils';

export function connectionName(n: SchemaNode, e: EdgeDeclaration | EdgeReferenceDeclaration) {
  return n.name + 'To' + upcaseAt(e.name, 0) + 'Connection';
}

export function edgeName(n: SchemaNode, e: EdgeDeclaration | EdgeReferenceDeclaration) {
  return n.name + 'To' + upcaseAt(e.name, 0) + 'Edge';
}
