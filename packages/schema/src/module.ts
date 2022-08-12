import { Import } from '@aphro/schema-api';

export function tsImport(name: string | null, as: string | null, from: string): Import {
  return {
    name: name?.trim(),
    as,
    from,
  };
}

export function javaImport(from: string): Import {
  return {
    from,
  };
}
