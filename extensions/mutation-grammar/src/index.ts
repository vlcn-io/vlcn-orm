import { TypeAtom, ValidationError } from '@aphro/schema-api';
import { GrammarExtension } from '@aphro/grammar-extension-api';
export * from './mutation.js';

// add our type to the node extensions
// export const name: unique symbol = Symbol('mutations');
export const name = 'mutations'; // symbol fails the type checker when used by client code 🤷‍♂️
declare module '@aphro/schema-api' {
  interface NodeExtensions {
    mutations?: Mutations;
  }

  interface NodeAstExtensions {
    mutations: MutationsAst;
  }

  interface EdgeExtensions {
    mutations?: Mutations;
  }

  interface EdgeAstExtensions {
    mutations?: MutationsAst;
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

export type MutationVerb = 'create' | 'update' | 'delete';

export type Mutation = {
  name: string;
  verb: MutationVerb;
  args: {
    [key: string]: MutationArgDef;
  };
};

export type MutationArgDef = FullArgDef | QuickArgDef;

export type FullArgDef = {
  type: 'full';
  optional: boolean;
  name: string;
  typeDef: TypeAtom[];
};

export type QuickArgDef = {
  type: 'quick';
  optional: boolean;
  name: string;
};

export type MutationsAst = {
  name: 'mutations';
  declarations: MutationAst[];
};

type MutationAst = {
  name: string;
  optional: boolean;
  args: MutationArgDef[];
  verb: MutationVerb;
};

const extension: GrammarExtension<MutationsAst, Mutations> = {
  name: 'mutations',
  extends: {
    NodeFunction: 'MutationsFn',
    EdgeFunction: 'MutationsFn',
  },

  grammar(): string {
    return String.raw`
MutationsFn
    = "Mutations" "{" MutationDeclarations "}"
  
MutationDeclarations
  = MutationDeclarations MutationDeclaration -- list
  | "" -- empty

MutationDeclaration
  = name "as" MutationVerb "{" MutationArgDeclarations "}"

MutationArgDeclarations
  = MutationArgDeclarations MutationArgDeclaration -- list
  | "" -- empty

MutationArgDeclaration
  = propertyKey "?"? TypeExpression -- full
  | name "?"? -- quick

MutationVerb
  = "Create"
  | "Update"
  | "Delete"
`;
  },

  actions() {
    return {
      MutationsFn(_, __, declarations, ___) {
        return {
          name,
          declarations: declarations.toAst(),
        };
      },
      MutationDeclarations_list: list,
      MutationDeclarations_empty: listInit,
      MutationDeclaration(name, _, verb, __, args, ___) {
        return {
          name: name.toAst(),
          verb: verb.toAst(),
          args: args.toAst(),
        };
      },
      MutationVerb(verb) {
        return verb.sourceString.toLocaleLowerCase();
      },
      MutationArgDeclarations_list: list,
      MutationArgDeclarations_empty: listInit,
      MutationArgDeclaration_full(name, optional, type) {
        return {
          type: 'full',
          optional: optional.sourceString === '?',
          name: name.toAst(),
          typeDef: type.toAst(),
        };
      },
      MutationArgDeclaration_quick(name, optional) {
        return {
          type: 'quick',
          optional: optional.sourceString === '?',
          name: name.toAst(),
        };
      },
    };
  },

  condensor(ast: MutationsAst): [ValidationError[], Mutations] {
    return [
      [],
      {
        name,
        mutations: ast.declarations.reduce(
          (
            l: {
              [key: string]: Mutation;
            },
            r,
          ) => {
            l[r.name] = {
              name: r.name,
              verb: r.verb,
              args: r.args.reduce((l: { [key: string]: MutationArgDef }, r) => {
                l[r.name] = r;
                return l;
              }, {}),
            };
            return l;
          },
          {},
        ),
      },
    ];
  },
};

export default extension;

const list = (l: any, r: any) => l.toAst().concat(r.toAst());
const listInit = (_: any) => [];
