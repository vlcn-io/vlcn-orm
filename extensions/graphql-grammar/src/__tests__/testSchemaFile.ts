import { name } from '../index.js';

export const contents = `
db: test
engine: sqlite

User as Node {
  id: ID<User>
  name: NaturalLanguage
} & GraphQL {
  read {
    id
    name
  }
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
          read: ['id', 'name'],
          write: [],
          root: undefined,
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
