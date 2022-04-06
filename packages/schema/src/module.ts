import { Import } from './SchemaType';

export function tsImport(name: string | null, as: string | null, from: string): Import {
  return {
    name: name?.replaceAll(/\s+/g, ''),
    as,
    from,
  };
}

export function javaImport(from: string): Import {
  return {
    from,
  };
}
