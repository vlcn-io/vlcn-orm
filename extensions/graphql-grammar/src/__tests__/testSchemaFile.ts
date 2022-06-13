import { name } from '../index.js';

export const contents = `
db: test
engine: postgres

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
      extensions: {
        [name]: {
          name,
          read: ['id', 'name'],
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
