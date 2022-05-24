import { name } from '../index.js';

export const contents = `
db: test
engine: postgres

User as Node {
  id: ID<User>
  name: NaturalLanguage
} & Mutations {
  create as Create {
    name
  }
  changeName as Update {
    name
  }
  delete as Delete {}
}
`;

export const compiled = {
  edges: {},
  nodes: {
    User: {
      extensions: {
        [name]: {
          name,
          mutations: {
            create: {
              args: { name: { name: 'name', type: 'quick' } },
              name: 'create',
              verb: 'create',
            },
            delete: { args: {}, name: 'delete', verb: 'delete' },
            changeName: {
              args: { name: { name: 'name', type: 'quick' } },
              name: 'changeName',
              verb: 'update',
            },
          },
        },
      },
      fields: {
        id: { name: 'id', of: 'User', type: 'id' },
        name: { name: 'name', type: 'naturalLanguage' },
      },
      name: 'User',
      primaryKey: 'id',
      storage: { db: 'test', engine: 'postgres', tablish: 'user', type: 'sql' },
    },
  },
};
