import { TypeAtom, ValidationError } from '@aphro/schema-api';
import { GrammarExtension } from '@aphro/grammar-extension-api';

declare module '@aphro/schema-api' {
  interface NodeExtensions {
    mutations?: Mutations;
  }

  interface NodeAstExtensions {
    mutations: MutationsAst;
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
  grammar(): string {
    return ``;
  },

  actions() {
    return {};
  },

  condensor(ast: MutationsAst): [ValidationError[], Mutations] {
    throw new Error();
  },
};
