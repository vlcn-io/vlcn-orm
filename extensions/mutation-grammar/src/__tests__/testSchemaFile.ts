import { name } from '../index.js';

export const contents = `
db: test
engine: sqlite

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
      type: 'node',
      extensions: {
        [name]: {
          name,
          mutations: {
            create: {
              args: { name: { name: 'name', optional: false, type: 'quick' } },
              name: 'create',
              verb: 'create',
            },
            delete: { args: {}, name: 'delete', verb: 'delete' },
            changeName: {
              args: { name: { name: 'name', optional: false, type: 'quick' } },
              name: 'changeName',
              verb: 'update',
            },
          },
        },
      },
      fields: {
        id: { name: 'id', type: [{ of: 'User', type: 'id' }] },
        name: { name: 'name', type: [{ type: 'naturalLanguage' }] },
      },
      name: 'User',
      primaryKey: 'id',
      storage: { db: 'test', engine: 'sqlite', tablish: 'user', type: 'sql', name: 'storage' },
    },
  },
};
