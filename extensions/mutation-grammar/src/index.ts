import { TypeAtom, ValidationError } from '@aphro/schema-api';
import { GrammarExtension } from '@aphro/grammar-extension-api';

// add our type to the node extensions
declare module '@aphro/schema-api' {
  interface NodeExtensions {
    mutations?: Mutations;
  }

  interface NodeAstExtensions {
    mutations: MutationsAst;
  }
}

// enable later extensions to also extend mutations
declare module '@aphro/grammar-extension-api' {
  interface ExtensionPoints {
    MutationExtension: string;
  }
}

export type Mutations = {
  name: 'mutations';
  mutations: {
    [key: string]: Mutation;
  };
};

type Mutation = {
  name: string;
  args: {
    [key: string]: MutationArgDef;
  };
};

type MutationArgDef =
  | {
      type: 'full';
      name: string;
      typeDef: TypeAtom[];
    }
  | {
      type: 'quick';
      name: string;
    };

export type MutationsAst = {
  name: 'mutations';
  declarations: MutationAst[];
};

type MutationAst = {
  name: string;
  args: MutationArgDef[];
};

const extension: GrammarExtension<MutationsAst, Mutations> = {
  extends: {
    NodeFunction: 'MutationsFn',
  },

  grammar(): string {
    return String.raw`
MutationsFn
    = "Mutations" "{" MutationDeclarations "}"
  
MutationDeclarations
  = MutationDeclarations MutationDeclaration -- list
  | "" -- empty

MutationDeclaration
  = name "{" MutationArgDeclarations "}"

MutationArgDeclarations
  = MutationArgDeclarations MutationArgDeclaration -- list
  | "" -- empty

MutationArgDeclaration
  = propertyKey TypeExpression -- full
  | name -- quick
`;
  },

  actions() {
    return {
      MutationsFn(_, __, declarations, ___) {
        return {
          name: 'mutations',
          declarations: declarations.toAst(),
        };
      },
      MutationDeclarations_list: list,
      MutationDeclarations_empty: listInit,
      MutationDeclaration(name, _, args, __) {
        return {
          name: name.toAst(),
          args: args.toAst(),
        };
      },
      MutationArgDeclarations_list: list,
      MutationArgDeclarations_empty: listInit,
      MutationArgDeclaration_full(name, type) {
        return {
          type: 'full',
          name: name.toAst(),
          typeDef: type.toAst(),
        };
      },
      MutationArgDeclaration_quick(name) {
        return {
          type: 'quick',
          name: name.toAst(),
        };
      },
    };
  },

  condensor(ast: MutationsAst): [ValidationError[], Mutations] {
    throw new Error('Condense not yet available for mutations');
  },
};

export default extension;

const list = (l, r) => l.toAst().concat(r.toAst());
const listInit = _ => [];
