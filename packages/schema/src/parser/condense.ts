import condenseEntities from "./condenseEntities.js";
import {
  EdgeAst,
  NodeAst,
  SchemaFileAst,
  Edge,
  Node,
  SchemaFile,
  StorageEngine,
  StorageType,
  Field,
  NodeAstExtension,
  EdgeExtension,
  NodeExtension,
  NodeTraitAst,
  NodeAstCommon,
} from "./SchemaType.js";
import { ValidationError } from "../v2/validate.js";
import { assertUnreahable } from "@strut/utils";

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
  schemaFile: SchemaFileAst
): [ValidationError[], SchemaFile] {
  const [nodes, edges, traits] = schemaFile.entities.reduce(
    (left: [NodeAst[], EdgeAst[], NodeTraitAst[]], nodeOrEdge) => {
      switch (nodeOrEdge.type) {
        case "node":
          left[0].push(nodeOrEdge);
          break;
        case "edge":
          left[1].push(nodeOrEdge);
          break;
        case "nodeTrait":
          left[2].push(nodeOrEdge);
          break;
        default:
          assertUnreahable(nodeOrEdge);
      }
      return left;
    },
    [[], [], []]
  );

  const [nodeMappingErrors, nodesByName] = arrayToMap(
    nodes,
    (n) => n.name,
    (n) => ({
      message: "A node has already been defined with the name " + n.name,
      severity: "error",
      type: "duplicate-nodes",
    })
  );
  const [edgeMappingErrors, edgesByName] = arrayToMap(
    edges,
    (e) => e.name,
    (e) => ({
      message: "An edge has already been defined with the name " + e.name,
      severity: "error",
      type: "duplicate-edges",
    })
  );
  const [traitMappingErrors, traitsByName] = arrayToMap(
    traits,
    (e) => e.name,
    (e) => ({
      message: "An trait has already been defined with the name " + e.name,
      severity: "error",
      type: "duplicate-traits",
    })
  );

  const [nodeErrors, validatedNodes] = condenseEntities(
    nodesByName,
    schemaFile.preamble,
    condenseNode
  );

  const [edgeErrors, validatedEdges] = condenseEntities(
    edgesByName,
    schemaFile.preamble,
    condenseEdge
  );

  const [traitErrors, validatedTraits] = condenseEntities(
    traitsByName,
    schemaFile.preamble,
    condenseNode
  );

  return [
    [...nodeMappingErrors, ...edgeMappingErrors, ...nodeErrors, ...edgeErrors],
    {
      nodes: validatedNodes,
      edges: validatedEdges,
    },
  ];
}

function condenseNode(
  node: NodeAstCommon,
  preamble: SchemaFileAst["preamble"]
): [ValidationError[], Node] {
  const [fieldErrors, fields] = condenseFieldsFor("Node", node);
  const [extensionErrors, extensions] = condenseExtensionsFor(
    "Node",
    node,
    nodeExtensionCondensor
  );

  return [
    [...fieldErrors, ...extensionErrors],
    {
      name: node.name,
      fields,
      extensions: extensions as Node["extensions"],
      storage: {
        type: engineToType(preamble.engine),
        engine: preamble.engine,
        db: preamble.db,
        table:
          (extensions.storage as any)?.table || node.name.toLocaleLowerCase(),
      },
    },
  ];
}

function condenseEdge(
  edge: EdgeAst,
  preamble: SchemaFileAst["preamble"]
): [ValidationError[], Edge] {
  const [fieldErrors, fields] = condenseFieldsFor("Edge", edge);
  const [extensionErrors, extensions] = condenseExtensionsFor(
    "Edge",
    edge,
    edgeExtensionCondensor
  );

  return [
    [...fieldErrors, ...extensionErrors],
    {
      name: edge.name,
      src: edge.src,
      dest: edge.dest,
      fields,
      extensions,
      storage: {
        type: engineToType(preamble.engine),
        engine: preamble.engine,
        db: preamble.db,
        // maybe we can figure out how to preseve the discrimnated type
        table:
          (extensions.storage as any)?.table || edge.name.toLocaleLowerCase(),
      },
    },
  ];
}

function condenseFieldsFor(
  entityType: string,
  entity: { name: string; fields: Field[] }
) {
  return arrayToMap(
    entity.fields,
    (f) => f.name,
    (f) => ({
      message: `${entityType} ${entity.name} had duplicate fields (${f.name}) defined`,
      severity: "error",
      type: "duplicate-fields",
    })
  );
}

function condenseExtensionsFor<T, R>(
  entityType: string,
  entity: { name: string; extensions: T[] },
  extensionCondensor: (T) => [ValidationError[], R]
): [ValidationError[], { [key: string]: R }] {
  const errorsAndExtensions = entity.extensions.map(extensionCondensor);
  const extensionErrors = errorsAndExtensions.flatMap((e) => e[0]);
  const condensedExtensions = errorsAndExtensions.map((e) => e[1]);
  const [extensionConflicts, extensionMap] = arrayToMap(
    condensedExtensions,
    (e) => e.name,
    (e) => ({
      message: `${entityType} ${entity.name} had duplicate extension (${e.name}) defined`,
      severity: "error",
      type: "duplicate-extensions",
    })
  );

  return [[...extensionErrors, ...extensionConflicts], extensionMap];
}

function engineToType(engine: StorageEngine): StorageType {
  switch (engine) {
    case "postgres":
    case "mysql":
      return "sql";
  }
}

function nodeExtensionCondensor(
  extension: NodeAstExtension
): [ValidationError[], NodeExtension] {
  switch (extension.name) {
    case "index":
      return [[], extension];
    case "inboundEdges":
    case "outboundEdges":
      const [errors, edges] = arrayToMap(
        extension.declarations,
        (e) => e.name,
        (e) => ({
          message: `Duplicate ${extension.name} found for edge ${e.name}`,
          severity: "error",
          type:
            extension.name === "inboundEdges"
              ? "duplicate-ib-edges"
              : "duplicate-ob-edges",
        })
      );
      return [
        errors,
        {
          name: extension.name,
          edges,
        },
      ];
    case "storage":
      return [[], extension];
  }
}

function edgeExtensionCondensor(
  extension: EdgeExtension
): [ValidationError[], EdgeExtension] {
  switch (extension.name) {
    case "constrain":
    case "index":
    case "invert":
    case "storage":
      return [[], extension];
  }
}

function arrayToMap<T extends Object>(
  array: T[],
  getKey: (T) => string,
  onDuplicate: (T) => ValidationError
): [ValidationError[], { [key: string]: T }] {
  const errors: ValidationError[] = [];
  const map = array.reduce((l, r) => {
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
