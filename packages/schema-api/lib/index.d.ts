export declare type StorageEngine = 'postgres' | 'mysql';
export declare type StorageType = 'sql';
export declare type SchemaFileAst = {
    preamble: {
        engine: StorageEngine;
        db: string;
    };
    entities: (NodeAst | EdgeAst | NodeTraitAst)[];
};
export declare type SchemaFile = {
    nodes: {
        [key: NodeReference]: Node;
    };
    edges: {
        [key: EdgeReference]: Edge;
    };
};
export declare type Node = {
    name: NodeAst['name'];
    fields: {
        [key: UnqalifiedFieldReference]: Field;
    };
    extensions: {
        outboundEdges?: OutboundEdges;
        inboundEdges?: InboundEdges;
        index?: Index;
        storage?: Storage;
        type?: TypeConfig;
        module?: ModuleConfig;
        traits?: Traits;
    };
    storage: StorageConfig;
};
export declare type NodeSpec = {
    readonly storage: StorageConfig;
    readonly outboundEdges: {
        [key: string]: EdgeSpec;
    };
};
declare type EdgeSpecBase = {
    source: NodeSpec;
    dest: NodeSpec;
};
export declare type EdgeSpec = ({
    type: 'junction';
    storage: StorageConfig;
} & EdgeSpecBase) | ({
    type: 'field';
    sourceField: string;
    destField: string;
} & EdgeSpecBase);
declare type TypeConfig = {
    name: 'typeConfig';
} & MaybeDecoratored;
declare type ModuleConfig = {
    name: 'moduleConfig';
    imports: Map<string, Import>;
};
export declare type Import = {
    name?: string | null;
    as?: string | null;
    from: string;
};
export declare type StorageConfig = {
    type: 'sql';
    db: string;
    tablish: string;
    engine: StorageEngine;
};
export declare type Edge = {
    name: EdgeAst['name'];
    src: NodeReferenceOrQualifiedColumn;
    dest: NodeReferenceOrQualifiedColumn | null;
    fields: {
        [key: UnqalifiedFieldReference]: Field;
    };
    extensions: {
        [Property in EdgeExtension['name']]?: EdgeExtension;
    };
    storage: StorageConfig;
};
export declare type RemoveNameField<Type> = {
    [Property in keyof Type as Exclude<Property, 'name'>]: Type[Property];
};
export declare type NodeReference = string;
declare type UnqalifiedFieldReference = string;
export declare type EdgeReference = string;
declare type NonComplexField = ID | NaturalLanguage | Enum | Currency | Time | Primitive;
declare type ComplexField = MapField | ArrayField;
export declare type Field = NonComplexField | ComplexField;
export declare type NodeAstExtension = OutboundEdgesAst | InboundEdgesAst | Index | Storage | Traits;
export declare type NodeExtension = Node['extensions'][keyof Node['extensions']];
export declare type NodeAst = {
    type: 'node';
} & NodeAstCommon;
export declare type NodeTraitAst = {
    type: 'nodeTrait';
} & NodeAstCommon;
export declare type NodeAstCommon = {
    name: string;
    fields: Field[];
    extensions: NodeAstExtension[];
};
export declare type EdgeExtension = Index | Invert | Constrain | Storage;
export declare type EdgeAst = {
    type: 'edge';
    name: string;
    src: NodeReferenceOrQualifiedColumn;
    dest: NodeReferenceOrQualifiedColumn | null;
    fields: Field[];
    extensions: EdgeExtension[];
};
declare type Invert = {
    name: 'invert';
    as: string;
};
declare type Constrain = {
    name: 'constrain';
};
declare type NodeReferenceOrQualifiedColumn = {
    type: NodeReference;
    column?: UnqalifiedFieldReference;
};
export declare type EdgeDeclaration = {
    type: 'edge';
    name: string;
    throughOrTo: NodeReferenceOrQualifiedColumn;
};
export declare type EdgeReferenceDeclaration = {
    type: 'edgeReference';
    name: string;
    reference: EdgeReference;
};
declare type MaybeDecoratored = {
    decorators?: string[];
};
declare type FieldBase = {
    decorators?: string[];
    description?: string;
    isRequired?: boolean;
};
export declare type ID = {
    name: string;
    type: 'id';
    of: NodeReference;
} & FieldBase;
declare type NaturalLanguage = {
    name: string;
    type: 'naturalLanguage';
} & FieldBase;
declare type Enum = {
    name: string;
    type: 'enumeration';
    keys: string[];
} & FieldBase;
declare type Currency = {
    name: string;
    type: 'currency';
    denomination: string;
} & FieldBase;
declare type Time = {
    name: string;
    type: 'timestamp';
} & FieldBase;
declare type Primitive = {
    name: string;
    type: 'primitive';
    subtype: 'bool' | 'int32' | 'int64' | 'float32' | 'float64' | 'uint32' | 'uint64' | 'string';
} & FieldBase;
declare type MapField = {
    name: string;
    type: 'map';
    keys: RemoveNameField<NonComplexField>;
    values: RemoveNameField<Field>;
} & FieldBase;
declare type ArrayField = {
    name: string;
    type: 'array';
    values: RemoveNameField<Field>;
} & FieldBase;
export declare type OutboundEdgesAst = {
    name: 'outboundEdges';
    declarations: (EdgeDeclaration | EdgeReferenceDeclaration)[];
};
export declare type OutboundEdges = {
    name: OutboundEdgesAst['name'];
    edges: {
        [key: EdgeReference]: EdgeDeclaration | EdgeReferenceDeclaration;
    };
};
export declare type InboundEdgesAst = {
    name: 'inboundEdges';
    declarations: (EdgeDeclaration | EdgeReferenceDeclaration)[];
};
export declare type InboundEdges = {
    name: InboundEdgesAst['name'];
    edges: {
        [key: EdgeReference]: EdgeDeclaration | EdgeReferenceDeclaration;
    };
};
declare type Index = {
    name: 'index';
    declarations: (Unique | NonUnique)[];
};
declare type Traits = {
    name: 'traits';
    declarations: string[];
};
declare type Storage = {
    name: 'storage';
    type?: StorageType;
    engine: StorageEngine;
    db?: string;
    table?: string;
};
declare type Unique = {
    name: string;
    type: 'unique';
    columns: UnqalifiedFieldReference[];
};
declare type NonUnique = {
    name: string;
    type: 'nonUnique';
    columns: UnqalifiedFieldReference[];
};
export {};
