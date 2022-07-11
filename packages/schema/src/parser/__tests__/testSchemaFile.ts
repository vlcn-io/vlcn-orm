import { InboundEdgesAst, SchemaFile, SchemaFileAst } from '@aphro/schema-api';

export const contents = `
engine: sqlite
db: test
complex: {
  a: b
  c: d
}

Person as Node {
  id: ID<Person>
  name: NaturalLanguage
  walletId: ID<Wallet>
  thing1: string
  thing2: string
} & OutboundEdges {
  wallet: Edge<Person.walletId>
  friends: Edge<Person>
  cars: Edge<Car.ownerId>
  follows: FollowEdge
  followedBy: FollowerEdge
} & InboundEdges {
  fromWallet: Edge<Person.walletId>
} & Index {
  walletId: unique(walletId)
  compound: thing1, thing2
  thing2
}

FollowEdge as Edge<Person, Person> {
  when: Timestamp
} & Invert as FollowerEdge

Wallet as Node {
  id: ID<Wallet>
  balance: float32
  status: Enumeration<Active | Locked>
  alias: NaturalLanguage
}

Transaction as Node {
  id: ID<Transaction>
  time: Timestamp
  blob: Map<string, string>
  blobOfBlob: Map<string, Map<string, string>>
  list: Array<string>
}

Pig as Node {
  optional: string | null
}

Fig as UnmanagedNode {
  wig: string
}
`;

export const ast: SchemaFileAst = {
  preamble: {
    engine: 'sqlite',
    db: 'test',
    complex: {
      a: 'b',
      c: 'd',
    },
  },
  entities: [
    {
      type: 'node',
      as: 'Node',
      name: 'Person',
      fields: [
        {
          name: 'id',
          type: [
            {
              type: 'id',
              of: 'Person',
            },
          ],
        },
        {
          name: 'name',
          type: [
            {
              type: 'naturalLanguage',
            },
          ],
        },
        {
          name: 'walletId',
          type: [
            {
              type: 'id',
              of: 'Wallet',
            },
          ],
        },
        {
          name: 'thing1',
          type: [
            {
              type: 'primitive',
              subtype: 'string',
            },
          ],
        },
        {
          name: 'thing2',
          type: [
            {
              type: 'primitive',
              subtype: 'string',
            },
          ],
        },
      ],
      extensions: [
        {
          name: 'outboundEdges',
          declarations: [
            {
              name: 'wallet',
              type: 'edge',
              throughOrTo: {
                type: 'Person',
                column: 'walletId',
              },
            },
            {
              name: 'friends',
              type: 'edge',
              throughOrTo: {
                type: 'Person',
              },
            },
            {
              name: 'cars',
              type: 'edge',
              throughOrTo: {
                type: 'Car',
                column: 'ownerId',
              },
            },
            {
              name: 'follows',
              type: 'edgeReference',
              reference: 'FollowEdge',
            },
            {
              name: 'followedBy',
              type: 'edgeReference',
              reference: 'FollowerEdge',
            },
          ],
        },
        {
          name: 'inboundEdges',
          declarations: [
            {
              name: 'fromWallet',
              type: 'edge',
              throughOrTo: {
                type: 'Person',
                column: 'walletId',
              },
            },
          ],
        } as InboundEdgesAst,
        {
          name: 'index',
          declarations: [
            {
              name: 'walletId',
              type: 'unique',
              columns: ['walletId'],
            },
            {
              name: 'compound',
              type: 'nonUnique',
              columns: ['thing1', 'thing2'],
            },
            {
              name: 'thing2',
              type: 'nonUnique',
              columns: ['thing2'],
            },
          ],
        },
      ],
    },
    {
      type: 'edge',
      src: {
        type: 'Person',
      },
      dest: {
        type: 'Person',
      },
      name: 'FollowEdge',
      fields: [
        {
          name: 'when',
          type: [
            {
              type: 'timestamp',
            },
          ],
        },
      ],
      extensions: [
        {
          name: 'invert',
          as: 'FollowerEdge',
        },
      ],
    },
    {
      type: 'node',
      as: 'Node',
      name: 'Wallet',
      fields: [
        {
          name: 'id',
          type: [
            {
              type: 'id',
              of: 'Wallet',
            },
          ],
        },
        {
          name: 'balance',
          type: [{ type: 'primitive', subtype: 'float32' }],
        },
        {
          name: 'status',
          type: [
            {
              type: 'enumeration',
              keys: ['Active', 'Locked'],
            },
          ],
        },
        {
          name: 'alias',
          type: [
            {
              type: 'naturalLanguage',
            },
          ],
        },
      ],
      extensions: [],
    },
    {
      type: 'node',
      as: 'Node',
      name: 'Transaction',
      fields: [
        {
          name: 'id',
          type: [
            {
              type: 'id',
              of: 'Transaction',
            },
          ],
        },
        {
          name: 'time',
          type: [{ type: 'timestamp' }],
        },
        {
          name: 'blob',
          type: [
            {
              type: 'map',
              keys: {
                type: 'primitive',
                subtype: 'string',
              },
              values: {
                type: 'primitive',
                subtype: 'string',
              },
            },
          ],
        },
        {
          name: 'blobOfBlob',
          type: [
            {
              type: 'map',
              keys: {
                type: 'primitive',
                subtype: 'string',
              },
              values: {
                type: 'map',
                keys: {
                  type: 'primitive',
                  subtype: 'string',
                },
                values: {
                  type: 'primitive',
                  subtype: 'string',
                },
              },
            },
          ],
        },
        {
          name: 'list',
          type: [
            {
              type: 'array',
              values: {
                type: 'primitive',
                subtype: 'string',
              },
            },
          ],
        },
      ],
      extensions: [],
    },
    {
      type: 'node',
      as: 'Node',
      name: 'Pig',
      fields: [
        {
          name: 'optional',
          type: [
            {
              type: 'primitive',
              subtype: 'string',
            },
            {
              type: 'union',
            },
            {
              type: 'primitive',
              subtype: 'null',
            },
          ],
        },
      ],
      extensions: [],
    },
    {
      type: 'node',
      as: 'UnmanagedNode',
      name: 'Fig',
      fields: [
        {
          name: 'wig',
          type: [
            {
              type: 'primitive',
              subtype: 'string',
            },
          ],
        },
      ],
      extensions: [],
    },
  ],
};

export const schemaFile: SchemaFile = {
  nodes: {
    Fig: {
      extensions: {},
      fields: {
        wig: {
          name: 'wig',
          type: [
            {
              subtype: 'string',
              type: 'primitive',
            },
          ],
        },
      },
      name: 'Fig',
      primaryKey: 'id',
      storage: {
        db: '--',
        engine: 'ephemeral',
        name: 'storage',
        tablish: 'ephemeral',
        type: 'ephemeral',
      },
      type: 'node',
    },
    Person: {
      type: 'node',
      name: 'Person',
      primaryKey: 'id',
      fields: {
        id: {
          name: 'id',
          type: [
            {
              type: 'id',
              of: 'Person',
            },
          ],
        },
        name: {
          name: 'name',
          type: [{ type: 'naturalLanguage' }],
        },
        walletId: {
          name: 'walletId',
          type: [{ type: 'id', of: 'Wallet' }],
        },
        thing1: {
          name: 'thing1',
          type: [{ type: 'primitive', subtype: 'string' }],
        },
        thing2: {
          name: 'thing2',
          type: [{ type: 'primitive', subtype: 'string' }],
        },
      },
      extensions: {
        outboundEdges: {
          name: 'outboundEdges',
          edges: {
            wallet: {
              name: 'wallet',
              type: 'edge',
              throughOrTo: {
                type: 'Person',
                column: 'walletId',
              },
            },
            friends: {
              name: 'friends',
              type: 'edge',
              throughOrTo: {
                type: 'Person',
              },
            },
            cars: {
              name: 'cars',
              type: 'edge',
              throughOrTo: {
                type: 'Car',
                column: 'ownerId',
              },
            },
            follows: {
              name: 'follows',
              type: 'edgeReference',
              reference: 'FollowEdge',
            },
            followedBy: {
              name: 'followedBy',
              type: 'edgeReference',
              reference: 'FollowerEdge',
            },
          },
        },
        inboundEdges: {
          name: 'inboundEdges',
          edges: {
            fromWallet: {
              name: 'fromWallet',
              type: 'edge',
              throughOrTo: {
                type: 'Person',
                column: 'walletId',
              },
            },
          },
        },
        index: {
          name: 'index',
          declarations: [
            {
              name: 'walletId',
              type: 'unique',
              columns: ['walletId'],
            },
            {
              name: 'compound',
              type: 'nonUnique',
              columns: ['thing1', 'thing2'],
            },
            {
              name: 'thing2',
              type: 'nonUnique',
              columns: ['thing2'],
            },
          ],
        },
      },
      storage: {
        name: 'storage',
        type: 'sql',
        engine: 'sqlite',
        db: 'test',
        tablish: 'person',
      },
    },
    Wallet: {
      type: 'node',
      name: 'Wallet',
      primaryKey: 'id',
      fields: {
        id: {
          name: 'id',
          type: [{ type: 'id', of: 'Wallet' }],
        },
        balance: {
          name: 'balance',
          type: [{ type: 'primitive', subtype: 'float32' }],
        },
        status: {
          name: 'status',
          type: [{ type: 'enumeration', keys: ['Active', 'Locked'] }],
        },
        alias: {
          name: 'alias',
          type: [{ type: 'naturalLanguage' }],
        },
      },
      extensions: {},
      storage: {
        name: 'storage',
        type: 'sql',
        engine: 'sqlite',
        db: 'test',
        tablish: 'wallet',
      },
    },
    Transaction: {
      type: 'node',
      name: 'Transaction',
      primaryKey: 'id',
      fields: {
        id: {
          name: 'id',
          type: [{ type: 'id', of: 'Transaction' }],
        },
        time: {
          name: 'time',
          type: [{ type: 'timestamp' }],
        },
        blob: {
          name: 'blob',
          type: [
            {
              type: 'map',
              keys: {
                type: 'primitive',
                subtype: 'string',
              },
              values: {
                type: 'primitive',
                subtype: 'string',
              },
            },
          ],
        },
        blobOfBlob: {
          name: 'blobOfBlob',
          type: [
            {
              type: 'map',
              keys: {
                type: 'primitive',
                subtype: 'string',
              },
              values: {
                type: 'map',
                keys: {
                  type: 'primitive',
                  subtype: 'string',
                },
                values: {
                  type: 'primitive',
                  subtype: 'string',
                },
              },
            },
          ],
        },
        list: {
          name: 'list',
          type: [
            {
              type: 'array',
              values: {
                type: 'primitive',
                subtype: 'string',
              },
            },
          ],
        },
      },
      extensions: {},
      storage: {
        name: 'storage',
        type: 'sql',
        engine: 'sqlite',
        db: 'test',
        tablish: 'transaction',
      },
    },
    Pig: {
      type: 'node',
      name: 'Pig',
      primaryKey: 'id',
      fields: {
        optional: {
          name: 'optional',
          type: [
            { subtype: 'string', type: 'primitive' },
            { type: 'union' },
            { type: 'primitive', subtype: 'null' },
          ],
        },
      },
      extensions: {},
      storage: {
        name: 'storage',
        type: 'sql',
        engine: 'sqlite',
        db: 'test',
        tablish: 'pig',
      },
    },
  },
  edges: {
    FollowEdge: {
      type: 'standaloneEdge',
      name: 'FollowEdge',
      src: {
        type: 'Person',
      },
      dest: {
        type: 'Person',
      },
      fields: {
        when: {
          name: 'when',
          type: [{ type: 'timestamp' }],
        },
      },
      extensions: {
        invert: {
          name: 'invert',
          as: 'FollowerEdge',
        },
      },
      storage: {
        name: 'storage',
        type: 'sql',
        engine: 'sqlite',
        db: 'test',
        tablish: 'followedge',
      },
    },
  },
};
