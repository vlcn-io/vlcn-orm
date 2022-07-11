import { FieldDeclaration, ID } from '@aphro/schema-api';

export default {
  decorate(f: FieldDeclaration, decoration: string) {
    const decorators = (f.decorators = f.decorators || []);
    decorators.push(decoration);
  },
  isNullable(f: FieldDeclaration): boolean {
    return f.type.some(t => t === 'null');
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
};
