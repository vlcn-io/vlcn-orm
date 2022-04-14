import { name } from '../index.js';

export const contents = `
db: test
engine: postgres

User as Node {
  id: ID<User>
  name: NaturalLanguage
} & Mutations {
  create {
    name
  }
  delete {}
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
            create: { args: { name: { name: 'name', type: 'quick' } }, name: 'create' },
            delete: { args: {}, name: 'delete' },
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
