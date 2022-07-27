import { FieldDeclaration, ID, TypeAtom } from '@aphro/schema-api';

export default {
  decorate(f: FieldDeclaration, decoration: string) {
    const decorators = (f.decorators = f.decorators || []);
    decorators.push(decoration);
  },
  isNullable(f: FieldDeclaration): boolean {
    return f.type.some(
      t =>
        t === 'null' || (typeof t !== 'string' && t.type === 'primitive' && t.subtype === 'null'),
    );
  },
  pullNamedTypesExcludingNull(f: FieldDeclaration): TypeAtom[] {
    return f.type.filter(t => {
      if (typeof t === 'string') {
        return t !== 'null';
      }
      if (t.type === 'primitive') {
        return t.subtype !== 'null';
      }
      return t.type !== 'intersection' && t.type !== 'union';
    });
  },
  removeNull(t: readonly TypeAtom[]): readonly TypeAtom[] {
    const nullIndex = t.findIndex(t => {
      if (typeof t !== 'string') {
        return t.type === 'primitive' && t.subtype === 'null';
      }
    });
    if (nullIndex < 0) {
      return t;
    }

    if (nullIndex === 0) {
      return t.slice(2);
    } else {
      return [...t.slice(0, nullIndex - 1), ...t.slice(nullIndex + 1)];
    }
  },
  pullNullType(f: FieldDeclaration): TypeAtom | undefined {
    return f.type.filter(t => {
      if (typeof t === 'string') {
        return t === 'null';
      }
      return t.type === 'primitive' && t.subtype === 'null';
    })[0];
  },
  hasId(f: FieldDeclaration): boolean {
    return f.type.some(t => typeof t !== 'string' && t.type === 'id');
  },
  getOnlyId(f: FieldDeclaration): ID {
    const ret = f.type.filter((t): t is ID => typeof t !== 'string' && t.type === 'id');
    if (ret.length > 1) {
      throw new Error(`Multiple id types exist for ${f.name}`);
    }
    return ret[0];
  },
  isComplex,
  encoding(f: FieldDeclaration): 'json' | 'none' {
    return isComplex(f) ? 'json' : 'none';
  },
};

function isComplex(f: FieldDeclaration): boolean {
  return f.type.some(t => typeof t === 'string' || t.type === 'array' || t.type === 'map');
}
