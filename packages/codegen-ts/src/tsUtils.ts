import { Field, Import, RemoveNameField, TypeAtom } from '@aphro/schema-api';
import { uniqueImports } from '@aphro/codegen';
import { assertUnreachable } from '@strut/utils';

export function fieldToTsType(field: RemoveNameField<Field>): string {
  let suffix = '';
  if (field.nullable) {
    suffix = ' | null';
  }
  switch (field.type) {
    case 'id':
      return `SID_of<${field.of}>` + suffix;
    case 'naturalLanguage':
      return 'string' + suffix;
    case 'enumeration':
      return field.keys.map(k => `'${k}'`).join('|');
    case 'timestamp':
      return 'number' + suffix;
    case 'primitive':
      switch (field.subtype) {
        case 'bool':
          return 'boolean' + suffix;
        case 'int32':
        case 'float32':
        case 'uint32':
          return 'number' + suffix;
        // since JS can't represent 64 bit numbers -- 53 bits is js max int.
        case 'int64':
        case 'float64':
        case 'uint64':
        case 'string':
          return 'string' + suffix;
        case 'null':
          return 'null';
        default:
          assertUnreachable(field.subtype);
      }
    case 'map':
      return `ReadonlyMap<${fieldToTsType(field.keys)}, ${fieldToTsType(field.values)}>` + suffix;
  }

  throw new Error(
    `Cannot convert from ${field.type} of ${JSON.stringify(field)} to a typescript type`,
  );
}

export function typeDefToTsType(def: TypeAtom[]): string {
  return def
    .map(a => {
      switch (a.type) {
        case 'union':
          return '|';
        case 'intersection':
          return '&';
        case 'primitive':
          return a.subtype;
        case 'type':
          if (typeof a.name === 'string') {
            return a.name + ` | Changeset<${a.name}, ${a.name}Data>`;
          }
          return fieldToTsType(a.name);
      }
    })
    .join(' ');
}

export function importToString(val: Import): string {
  const name = val.name != null ? val.name + ' ' : '';
  const as = val.as != null ? 'as ' + val.as + ' ' : '';
  if (name === '') {
    return `import "${val.from}";`;
  } else if (name[0] === '{' && val.as != null) {
    return `import ${name.substring(0, name.length - 2)} ${as}} from '${val.from}';`;
  } else {
    return `import ${name}${as}from '${val.from}';`;
  }
}

// Uniques and collapses imports.
export function importsToString(imports: readonly Import[]): string {
  return collapseImports(uniqueImports(imports)).map(importToString).join('\n');
}

export function collapseImports(imports: readonly Import[]): readonly Import[] {
  // not yet implemented
  return imports;
}

const keywords = new Set([
  'abstract',
  'aruments',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'impleents',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'syncrhonized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
]);
export function isKeyword(s: string): boolean {
  return keywords.has(s);
}
