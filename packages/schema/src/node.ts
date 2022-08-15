import {
  Enum,
  Field,
  FieldDeclaration,
  ID,
  Import,
  SchemaEdge,
  SchemaNode,
} from '@aphro/schema-api';
import fieldFn from './field.js';

const inboundEdges = {
  isForeignKeyEdge() {},

  isFieldEdge() {},

  isJunctionEdge() {},
};

const outboundEdges = {
  isForeignKeyEdge() {},

  isFieldEdge() {},

  isJunctionEdge() {},
};

const fields = {};

export default {
  allEdges(node: SchemaNode) {
    const inboundEdges = Object.values(node.extensions.inboundEdges?.edges || {});
    const outboundEdges = Object.values(node.extensions.outboundEdges?.edges || {});

    return [...inboundEdges, ...outboundEdges];
  },

  queryTypeName(nodeName: string): string {
    return nodeName + 'Query';
  },

  addModuleImport(node: SchemaNode, imp: Import) {
    const module = (node.extensions.module = node.extensions.module || {
      name: 'moduleConfig',
      imports: new Map(),
    });

    module.imports.set(JSON.stringify(imp), imp);
  },

  decorateType(node: SchemaNode, decoration: string) {
    const typeConfig = node.extensions.type || {
      name: 'typeConfig',
      decorators: [],
    };

    typeConfig.decorators?.push(decoration);
  },

  primaryKey(node: SchemaNode): FieldDeclaration {
    // TODO: support different primary key fields at some point
    return node.fields.id;
  },

  specName(nodeName: string, srcName?: string): string {
    return nodeName + 'Spec';
  },

  inlineEnums(node: SchemaNode): Enum[] {
    return Object.values(node.fields)
      .flatMap(f => f.type)
      .filter((f): f is Enum => typeof f !== 'string' && f.type === 'enumeration');
  },

  isRequiredField(node: SchemaNode, field: string): boolean {
    return !fieldFn.isNullable(node.fields[field]);
  },

  tableName(node: SchemaNode | SchemaEdge): string {
    return node.name.toLowerCase();
  },
};
