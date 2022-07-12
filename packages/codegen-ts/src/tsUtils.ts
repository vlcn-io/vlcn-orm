import { Field, FieldDeclaration, Import, RemoveNameField, TypeAtom } from '@aphro/schema-api';
import { uniqueImports } from '@aphro/codegen';
import { assertUnreachable } from '@strut/utils';

export function fieldToTsType(field: RemoveNameField<FieldDeclaration>): string {
  return field.type.map(t => atomToTsType(t)).join(' ');
}

export function atomToTsType(a: TypeAtom): string {
  if (typeof a === 'string') {
    return a;
  }

  const kind = a.type;
  switch (kind) {
    case 'id':
      return `SID_of<${a.of}>`;
    case 'naturalLanguage':
      return 'string';
    case 'enumeration':
      return a.keys.map(k => `'${k}'`).join('|');
    case 'timestamp':
      return 'number';
    case 'primitive':
      switch (a.subtype) {
        case 'bool':
          return 'boolean';
        case 'int32':
        case 'float32':
        case 'uint32':
          return 'number';
        // since JS can't represent 64 bit numbers -- 53 bits is js max int.
        case 'int64':
        case 'float64':
        case 'uint64':
        case 'string':
          return 'string';
        case 'null':
          return 'null';
        case 'any':
          return 'any';
        default:
          assertUnreachable(a.subtype);
      }
    case 'map':
      return `ReadonlyMap<${atomToTsType(a.keys)}, ${atomToTsType(a.values)}>`;
    case 'array':
      return `readonly (${atomToTsType(a.values)})[]`;
    case 'intersection':
      return '&';
    case 'union':
      return '|';
    default:
      assertUnreachable(kind);
  }
}

export function typeDefToTsType(def: TypeAtom[]): string {
  return def
    .map(a => {
      if (typeof a === 'string') {
        return a + ` | Changeset<${a}, ${a}Data>`;
      }
      return atomToTsType(a);
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
