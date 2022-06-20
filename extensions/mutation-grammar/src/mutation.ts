import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { FullArgDef, MutationArgDef } from './index.js';

function transformQuickToFull(node: SchemaNode | SchemaEdge, arg: MutationArgDef): FullArgDef {
  const field = node.fields[arg.name];
  return {
    type: 'full',
    name: arg.name,
    typeDef: [
      {
        type: 'type',
        name: field,
      },
    ],
  };
}

export const mutationFn = {
  transformMaybeQuickToFull(node: SchemaNode | SchemaEdge, arg: MutationArgDef): FullArgDef {
    switch (arg.type) {
      case 'full':
        return arg;
      case 'quick':
        return transformQuickToFull(node, arg);
    }
  },

  transformQuickToFull,
};
