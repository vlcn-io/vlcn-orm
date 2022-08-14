import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { FullArgDef, MutationArgDef } from './index.js';

function transformQuickToFull(node: SchemaNode | SchemaEdge, arg: MutationArgDef): FullArgDef {
  const field = node.fields[arg.name];
  if (field == null) {
    throw new Error(
      `When generating mutation for ${node.name} could not find a field named ${arg.name}. Did you mean to declare the type with the argument?`,
    );
  }
  return {
    type: 'full',
    optional: arg.optional,
    name: arg.name,
    typeDef: field.type,
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
