import { fieldFn } from '@aphro/schema';
import {
  Enum,
  Field,
  SchemaNode,
  RemoveNameField,
  FieldDeclaration,
  TypeAtom,
} from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import { inlineEnumName } from './inlineEnumName.js';

// TODO: Aphrodite must enable computational & storage types + semantic types.
// Do we really want to get into the semantic type game given people will have different understandings
// of the semantics? Can people bring their own semantics? Akin to JsonSchema?
export function fieldTypeToGraphQLType(
  n: SchemaNode,
  f: RemoveNameField<FieldDeclaration>,
): string {
  let type = fieldFn.removeNull(f.type);
  const nullable = type.length !== f.type.length;

  return type
    .map(
      a =>
        atomToGraphQLType(n, f, a) +
        (!nullable && typeof a !== 'string' && a.type !== 'intersection' && a.type !== 'union'
          ? '!'
          : ''),
    )
    .join(' ');
}

function atomToGraphQLType(
  n: SchemaNode,
  f: RemoveNameField<FieldDeclaration>,
  type: TypeAtom,
): string {
  let ret: string;
  if (typeof type === 'string') {
    return type;
  }
  const kind = type.type;
  switch (kind) {
    case 'array':
      return `[${atomToGraphQLType(n, f, type.values)}]`;
    case 'enumeration':
      // TODO o boi... enums inline in array will break all the things.
      return inlineEnumName(n, type as Enum);
    case 'id':
      return 'ID';
    case 'map':
      throw new Error(
        `Map can not yet be exposed to GraphQL for field ${(f as FieldDeclaration).name} of node ${
          n.name
        }`,
      );
    case 'naturalLanguage':
      return 'String';
    case 'timestamp':
      // given GraphQL ints are short
      return 'String';
    case 'primitive':
      switch (type.subtype) {
        case 'bool':
          return 'Boolean';
        case 'float32':
        case 'float64':
          return 'Float';
        case 'int32':
          return 'Int';
        case 'int64':
          return 'String';
        case 'null':
          return 'null';
        case 'string':
          return 'String';
        case 'uint32':
          return 'Int';
        case 'uint64':
          return 'String';
        case 'any':
          return 'String';
        default:
          assertUnreachable(type.subtype);
      }
    case 'union':
      return '|';
    case 'intersection':
      return '&';
    default:
      assertUnreachable(kind);
  }
}
