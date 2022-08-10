import condenseEntities from './condenseEntities.js';
import {
  EdgeAst,
  NodeAst,
  SchemaFileAst,
  SchemaEdge,
  SchemaNode,
  SchemaFile,
  StorageEngine,
  StorageType,
  NodeAstExtension,
  EdgeExtension,
  NodeExtension,
  NodeTraitAst,
  ValidationError,
  StorageConfig,
  FieldDeclaration,
} from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';

/**
 * The AST returned by the parser gives us lists of items.
 * Convert that list of items into maps of items.
 * E.g.,
 * ```
 * {
 *   nodes: {
 *     [node.name] => node,
 *     ...
 *   }
 *   edges: {
 *     [edge.name] => edge,
 *     ...
 *   }
 * }
 * ```
 *
 * Descends into nodes and edges and does the same for their fields
 * and extensions.
 *
 * We do this so we can easily look up nodes and edges when one node/edge refers
 * to another.
 *
 * We also gether up a list of errors that occur in this process, such as
 * field/edge/node/extension name conflicts.
 *
 * These errors are reported to the user further upstream.
 *
 * We collect as many as we can, rather than bailing early, so the user
 * can fix all errors before having to re-run compilation.
 */
export default function condense(
  schemaFile: SchemaFileAst,
  condensors: Map<
    string | Symbol,
    (x: any) => [ValidationError[], NodeExtension | EdgeExtension]
  > = new Map(),
): [ValidationError[], SchemaFile] {
  function nodeExtensionCondensor(extension: NodeAstExtension): [ValidationError[], NodeExtension] {
    switch (extension.name) {
      case 'index':
      case 'traits':
        return [[], extension];
      case 'inboundEdges':
      case 'outboundEdges':
        const [errors, edges] = arrayToMap(
          extension.declarations,
          e => e.name,
          e => ({
            message: `Duplicate ${extension.name} found for edge ${e.name}`,
            severity: 'error',
            type: extension.name === 'inboundEdges' ? 'duplicate-ib-edges' : 'duplicate-ob-edges',
          }),
        );
        return [
          errors,
          {
            name: extension.name,
            edges,
          },
        ];
      case 'storage':
        return [[], extension];
      default:
        // @ts-ignore -- TODO: how do we make typescript aware of client extensions to types?
        const condensor = condensors.get(extension.name);
        if (!condensor) {
          // @ts-ignore
          throw new Error(`Unable to find condensor for ${extension.name}`);
        }
        // @ts-ignore
        return condensor(extension);
    }
  }

  function edgeExtensionCondensor(extension: EdgeExtension): [ValidationError[], EdgeExtension] {
    switch (extension?.name) {
      case 'constrain':
      case 'index':
      case 'invert':
      case 'storage':
        return [[], extension];
      default:
        // @ts-ignore -- TODO: how do we make typescript aware of client extensions to types?
        const condensor = condensors.get(extension.name);
        if (!condensor) {
          // @ts-ignore
          throw new Error(`Unable to find condensor for ${extension.name}`);
        }
        // @ts-ignore
        return condensor(extension);
    }
  }

  function condenseNode(
    node: NodeAst | NodeTraitAst,
    preamble: SchemaFileAst['preamble'],
  ): [ValidationError[], SchemaNode] {
    const [fieldErrors, fields] = condenseFieldsFor('Node', node);
    const [extensionErrors, extensions] = condenseExtensionsFor(
      'Node',
      node,
      // @ts-ignore
      nodeExtensionCondensor,
    );

    let storageExtension = (extensions.storage as undefined | StorageConfig) || {};
    if (node.type === 'node' && node.as === 'UnmanagedNode') {
      storageExtension = {
        name: 'storage',
        db: '--',
        engine: 'ephemeral',
        type: 'ephemeral',
        tablish: 'ephemeral',
      };
    }

    return [
      [...fieldErrors, ...extensionErrors],
      {
        type: 'node',
        name: node.name,
        primaryKey: 'id',
        fields,
        extensions: extensions as SchemaNode['extensions'],
        storage: {
          name: 'storage',
          db: preamble.db,
          engine: preamble.engine,
          type: engineToType(preamble.engine),
          tablish: (extensions.storage as any)?.tablish || node.name.toLocaleLowerCase(),
          ...storageExtension,
        },
      },
    ];
  }

  function condenseEdge(
    edge: EdgeAst,
    preamble: SchemaFileAst['preamble'],
  ): [ValidationError[], SchemaEdge] {
    const [fieldErrors, fields] = condenseFieldsFor('Edge', edge);
    const [extensionErrors, extensions] = condenseExtensionsFor(
      'Edge',
      edge,
      // @ts-ignore
      edgeExtensionCondensor,
    );

    return [
      [...fieldErrors, ...extensionErrors],
      {
        type: 'standaloneEdge',
        name: edge.name,
        src: edge.src,
        dest: edge.dest,
        fields,
        extensions,
        storage: {
          name: 'storage',
          type: engineToType(preamble.engine),
          engine: preamble.engine,
          db: preamble.db,
          // maybe we can figure out how to preseve the discrimnated type
          tablish: (extensions.storage as any)?.tablish || edge.name.toLocaleLowerCase(),
        },
      },
    ];
  }

  const [nodes, edges, traits] = schemaFile.entities.reduce(
    (left: [NodeAst[], EdgeAst[], NodeTraitAst[]], nodeOrEdge) => {
      switch (nodeOrEdge.type) {
        case 'node':
          left[0].push(nodeOrEdge);
          break;
        case 'edge':
          left[1].push(nodeOrEdge);
          break;
        case 'nodeTrait':
          left[2].push(nodeOrEdge);
          break;
        default:
          assertUnreachable(nodeOrEdge);
      }
      return left;
    },
    [[], [], []],
  );

  const [nodeMappingErrors, nodesByName] = arrayToMap(
    nodes,
    n => n.name,
    n => ({
      message: 'A node has already been defined with the name ' + n.name,
      severity: 'error',
      type: 'duplicate-nodes',
    }),
  );
  const [edgeMappingErrors, edgesByName] = arrayToMap(
    edges,
    e => e.name,
    e => ({
      message: 'An edge has already been defined with the name ' + e.name,
      severity: 'error',
      type: 'duplicate-edges',
    }),
  );
  const [traitMappingErrors, traitsByName] = arrayToMap(
    traits,
    e => e.name,
    e => ({
      message: 'An trait has already been defined with the name ' + e.name,
      severity: 'error',
      type: 'duplicate-traits',
    }),
  );

  const [nodeErrors, validatedNodes] = condenseEntities(
    nodesByName,
    schemaFile.preamble,
    condenseNode,
  );

  const [edgeErrors, validatedEdges] = condenseEntities(
    edgesByName,
    schemaFile.preamble,
    condenseEdge,
  );

  const [traitErrors, validatedTraits] = condenseEntities(
    traitsByName,
    schemaFile.preamble,
    condenseNode,
  );

  return [
    [...nodeMappingErrors, ...edgeMappingErrors, ...nodeErrors, ...edgeErrors],
    {
      nodes: validatedNodes,
      edges: validatedEdges,
    },
  ];
}

function condenseFieldsFor(
  entityType: string,
  entity: { name: string; fields: FieldDeclaration[] },
) {
  return arrayToMap(
    entity.fields,
    f => f.name,
    f => ({
      message: `${entityType} ${entity.name} had duplicate fields (${f.name}) defined`,
      severity: 'error',
      type: 'duplicate-fields',
    }),
  );
}

function condenseExtensionsFor<T, R extends { name: string }>(
  entityType: string,
  entity: { name: string; extensions: T[] },
  extensionCondensor: (x: T) => [ValidationError[], R],
): [ValidationError[], { [key: string]: R }] {
  const errorsAndExtensions = entity.extensions.map(extensionCondensor);
  const extensionErrors = errorsAndExtensions.flatMap(e => e[0]);
  const condensedExtensions = errorsAndExtensions.map(e => e[1]);
  const [extensionConflicts, extensionMap] = arrayToMap(
    condensedExtensions,
    e => e.name,
    e => ({
      message: `${entityType} ${entity.name} had duplicate extension (${e.name}) defined`,
      severity: 'error',
      type: 'duplicate-extensions',
    }),
  );

  return [[...extensionErrors, ...extensionConflicts], extensionMap];
}

function engineToType(engine: StorageEngine): StorageType {
  switch (engine) {
    case 'sqlite':
    case 'postgres':
      return 'sql';
    case 'memory':
      return 'memory';
    case 'ephemeral':
      return 'ephemeral';
  }
}

function arrayToMap<T extends Object>(
  array: T[],
  getKey: (v: T) => string,
  onDuplicate: (v: T) => ValidationError,
): [ValidationError[], { [key: string]: T }] {
  const errors: ValidationError[] = [];
  const map = array.reduce((l: { [key: string]: T }, r: T) => {
    const key = getKey(r);
    if (l[key] !== undefined) {
      errors.push(onDuplicate(r));
    }
    l[key] = r;
    return l;
  }, {});
  return [errors, map];
}

// TODO: we need to condense extensions.

// Iterate over all the things in the schema file
// set up storage configs with defaults that were defined in the preamble
// ensure no collisions on node/edge names
// ensure no collisions on field names
// suggest indexing of foreign keys
// ensure primary keys exist
// ...
// we should probs support imports at some point in time
// convert edges to field / foreign key / junction / ... types
