import { Import } from '@aphro/schema-api';

export default function uniqueImports(imports: readonly Import[]): Import[] {
  const seen = new Set();
  const ret = imports.filter(i => {
    const key = toKey(i);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return ret;
}

function toKey(i: Import) {
  return i.name + '-' + i.as + '-' + i.from;
}
