import { Edge, EdgeDeclaration, EdgeReferenceDeclaration, Node } from '@aphro/schema-api';
import { upcaseAt } from '@strut/utils';

export function connectionName(n: Node, e: EdgeDeclaration | EdgeReferenceDeclaration) {
  return n.name + 'To' + upcaseAt(e.name, 0) + 'Connection';
}

export function edgeName(n: Node, e: EdgeDeclaration | EdgeReferenceDeclaration) {
  return n.name + 'To' + upcaseAt(e.name, 0) + 'Edge';
}
