import { Enum, Field, Node, RemoveNameField } from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import { inlineEnumName } from './inlineEnumName';

// TODO: Aphrodite must enable computational & storage types + semantic types.
// Do we really want to get into the semantic type game given people will have different understandings
// of the semantics? Can people bring their own semantics? Akin to JsonSchema?
export function fieldTypeToGraphQLType(n: Node, f: RemoveNameField<Field>): string {
  const type = f.type;
  let ret: string;
  switch (type) {
    case 'array':
      ret = `[${fieldTypeToGraphQLType(n, f.values)}]`;
      break;
    case 'currency':
      ret = 'Float';
      break;
    case 'enumeration':
      // TODO o boi... enums inline in array will break all the things.
      ret = inlineEnumName(n, f as Enum);
      break;
    case 'id':
      ret = 'ID';
      break;
    case 'map':
      throw new Error(
        `Map can not yet be exposed to GraphQL for field ${(f as Field).name} of node ${n.name}`,
      );
    case 'naturalLanguage':
      ret = 'String';
      break;
    case 'timestamp':
      // given GraphQL ints are short
      ret = 'String';
      break;
    case 'primitive':
      switch (f.subtype) {
        case 'bool':
          ret = 'Boolean';
          break;
        case 'float32':
        case 'float64':
          ret = 'Float';
          break;
        case 'int32':
          ret = 'Int';
          break;
        case 'int64':
          ret = 'String';
          break;
        case 'null':
          throw new Error(
            `Cannot represent only null in GraphQL for field ${(f as Field).name} of node ${
              n.name
            }`,
          );
        case 'string':
          ret = 'String';
          break;
        case 'uint32':
          ret = 'Int';
          break;
        case 'uint64':
          ret = 'String';
          break;
        default:
          assertUnreachable(f.subtype);
      }
      break;
    default:
      assertUnreachable(type);
  }

  if (!f.nullable) {
    ret = ret + '!';
  }

  return ret;
}
