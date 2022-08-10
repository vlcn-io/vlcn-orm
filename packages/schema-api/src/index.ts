export type ValidationError = {
  message: string;
  severity: 'warning' | 'advice' | 'error';
  type:
    | 'duplicate-nodes'
    | 'duplicate-edges'
    | 'duplicate-fields'
    | 'duplicate-ob-edges'
    | 'duplicate-ib-edges'
    | 'duplicate-extensions'
    | 'duplicate-traits';
};

// "memory" nodes get stored into an in-memory DB and never cleared until they are deleted.
// "ephemeral" nodes are in-memory only as well but not stored anywhere.
export type StorageEngine = 'sqlite' | 'postgres' | 'memory' | 'ephemeral';
export type StorageType = 'sql' | 'memory' | 'ephemeral';

export type SchemaFileAst = {
  preamble: {
    engine: StorageEngine;
    db: string;
    [key: string]: Object | string; // other engine-specific values
  };
  entities: (NodeAst | EdgeAst | NodeTraitAst)[];
};

export type SchemaFile = {
  nodes: {
    [key: NodeReference]: SchemaNode;
  };
  edges: {
    [key: EdgeReference]: SchemaEdge;
  };
};

export interface NodeExtensions {
  outboundEdges?: OutboundEdges;
  inboundEdges?: InboundEdges;
  index?: Index;
  storage?: StorageConfig;
  replication?: ReplicationConfig;
  type?: TypeConfig;
  module?: ModuleConfig;
  traits?: Traits;
}

export interface NodeAstExtensions {
  outboundEdges: OutboundEdgesAst;
  inboundEdges: InboundEdgesAst;
  index: Index;
  storage: StorageConfig;
  replication: ReplicationConfig;
  traits: Traits;
}

export type SchemaNode = {
  type: 'node';
  name: NodeAst['name'];
  primaryKey: string;
  fields: {
    [key: UnqalifiedFieldReference]: FieldDeclaration;
  };
  extensions: NodeExtensions;
  storage: StorageConfig;
};

export type NodeSpec = {
  readonly type: 'node';
  readonly primaryKey: string;
  readonly storage: RemoveNameField<StorageConfig>;
  readonly outboundEdges: { [key: string]: EdgeSpec };

  readonly fields: FieldsSpec;
};

export type FieldsSpec = {
  [key: string]: {
    readonly encoding: 'json' | 'none';
  };
};

type EdgeSpecBase = {
  readonly source: NodeSpec;
  readonly dest: NodeSpec;
};

export type EdgeSpec =
  | JunctionEdgeSpec
  | ({
      type: 'field';
      sourceField: string;
      destField: string;
    } & EdgeSpecBase)
  | ({
      type: 'foreignKey';
      sourceField: string;
      destField: string;
    } & EdgeSpecBase);

export type JunctionEdgeSpec = {
  readonly type: 'junction';
  readonly storage: RemoveNameField<StorageConfig>;
  readonly sourceField: string;
  readonly destField: string;

  readonly fields: FieldsSpec;
} & EdgeSpecBase;

export type EdgeType = EdgeSpec['type'];

type TypeConfig = {
  name: 'typeConfig';
} & MaybeDecoratored;

type ModuleConfig = {
  name: 'moduleConfig';
  imports: Map<string, Import>;
};

export type Import = {
  name?: string | null;
  as?: string | null;
  from: string;
};

export type StorageConfig = {
  name: 'storage';
  type: StorageType;
  db: string;
  tablish: string;
  engine: StorageEngine;
  [key: string]: string; // engine specific extras
}; // | { type: "opencypher" } ...;

export type ReplicationConfig = {
  name: 'replication';
  replicated: boolean;
  // other replication settings
};

export type SchemaEdge = {
  type: 'standaloneEdge';
  name: EdgeAst['name'];
  src: NodeReferenceOrQualifiedColumn;
  dest: NodeReferenceOrQualifiedColumn;
  fields: {
    [key: UnqalifiedFieldReference]: FieldDeclaration;
  };
  extensions: EdgeExtensions;
  storage: StorageConfig;
};

export type RemoveNameField<Type> = {
  [Property in keyof Type as Exclude<Property, 'name'>]: Type[Property];
};

export type NodeReference = string;
type UnqalifiedFieldReference = string;
export type EdgeReference = string;

type NonComplexField = ID | NaturalLanguage | Enum | Time | Primitive;

type ComplexField = MapField | ArrayField;

export type Field = NonComplexField | ComplexField;
export type NodeAstExtension = NodeAstExtensions[keyof NodeAstExtensions];
export type NodeExtension = SchemaNode['extensions'][keyof SchemaNode['extensions']];
export type FieldDeclaration = {
  num?: number;
  name: string;
  type: TypeAtom[];
  decorators?: string[];
};

export type NodeAst = {
  type: 'node';
  as: 'Node' | 'UnmanagedNode';
} & NodeAstCommon;

export type NodeTraitAst = {
  type: 'nodeTrait';
} & NodeAstCommon;

export type NodeAstCommon = {
  name: string;
  fields: FieldDeclaration[];
  extensions: NodeAstExtension[];
};

export interface EdgeExtensions {
  index?: Index;
  invert?: Invert;
  constrain?: Constrain;
  storage?: StorageConfig;
  replication?: ReplicationConfig;
}
// export interface EdgeAstExtensions {
//   index: Index;
//   invert: Invert;
//   storage: StorageConfig;
//   constraint: Constrain;
//   replication: ReplicationConfig;
// }

// export type EdgeAstExtension = EdgeAstExtensions[keyof EdgeAstExtensions];
export type EdgeExtension = SchemaEdge['extensions'][keyof SchemaEdge['extensions']];

export type EdgeAst = {
  type: 'edge';
  name: string;
  src: NodeReferenceOrQualifiedColumn;
  dest: NodeReferenceOrQualifiedColumn;
  fields: FieldDeclaration[];
  extensions: EdgeExtension[];
};

type Invert = {
  name: 'invert';
  as: string;
};

type Constrain = {
  name: 'constrain';
};

type NodeReferenceOrQualifiedColumn = {
  type: NodeReference;
  column?: UnqalifiedFieldReference;
};

export type EdgeDeclaration = {
  type: 'edge';
  name: string;
  throughOrTo: NodeReferenceOrQualifiedColumn;
};

export type EdgeReferenceDeclaration = {
  type: 'edgeReference';
  name: string;
  reference: EdgeReference;
};

type MaybeDecoratored = {
  decorators?: string[];
};

type FieldBase = {
  description?: string;
  nullable?: boolean;
};

export type ID = {
  name: string;
  type: 'id';
  of: NodeReference;
} & FieldBase;

type NaturalLanguage = {
  name: string;
  type: 'naturalLanguage';
} & FieldBase;

export type Enum = {
  name: string;
  type: 'enumeration';
  keys: string[];
} & FieldBase;

type Time = {
  name: string;
  type: 'timestamp';
} & FieldBase;

export const primitives = [
  'bool',
  'int32',
  'int64',
  'float32',
  'float64',
  'uint32',
  'uint64',
  'string',
  'null',
  'any',
] as const;

export type PrimitiveSubtype = typeof primitives[number];
type Primitive = {
  name: string;
  type: 'primitive';
  subtype: PrimitiveSubtype;
} & FieldBase;

type MapField = {
  name: string;
  type: 'map';
  // Ideally we use `Omit` on name but see https://github.com/microsoft/TypeScript/issues/31501
  keys: RemoveNameField<NonComplexField>;
  values: RemoveNameField<Field>;
} & FieldBase;

type ArrayField = {
  name: string;
  type: 'array';
  // Ideally we use `Omit` on name but see https://github.com/microsoft/TypeScript/issues/31501
  values: RemoveNameField<Field> | string;
} & FieldBase;

export type OutboundEdgesAst = {
  name: 'outboundEdges';
  declarations: (EdgeDeclaration | EdgeReferenceDeclaration)[];
};

export type OutboundEdges = {
  name: OutboundEdgesAst['name'];
  edges: {
    [key: EdgeReference]: EdgeDeclaration | EdgeReferenceDeclaration;
  };
};

export type InboundEdgesAst = {
  name: 'inboundEdges';
  declarations: (EdgeDeclaration | EdgeReferenceDeclaration)[];
};

export type InboundEdges = {
  name: InboundEdgesAst['name'];
  edges: {
    [key: EdgeReference]: EdgeDeclaration | EdgeReferenceDeclaration;
  };
};

type Index = {
  name: 'index';
  declarations: (Unique | NonUnique)[];
};

type Traits = {
  name: 'traits';
  declarations: string[];
};

export type TypeAtom =
  | RemoveNameField<Field>
  | string
  | {
      type: 'intersection';
    }
  | { type: 'union' };

type Unique = {
  name: string;
  type: 'unique';
  columns: UnqalifiedFieldReference[];
};

type NonUnique = {
  name: string;
  type: 'nonUnique';
  columns: UnqalifiedFieldReference[];
};
