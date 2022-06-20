import { Enum, Field, ID, Import, SchemaNode } from '@aphro/schema-api';

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

  primaryKey(node: SchemaNode): Field {
    // TODO: support different primary key fields at some point
    return node.fields.id;
  },

  specName(nodeName: string): string {
    return nodeName + 'Spec';
  },

  inlineEnums(node: SchemaNode): Enum[] {
    return Object.values(node.fields).filter((f): f is Enum => f.type === 'enumeration');
  },
};
