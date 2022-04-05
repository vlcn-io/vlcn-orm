import { Import } from "..//parser/SchemaType";

export function tsImport(
  name: string | null,
  as: string | null,
  from: string
): Import {
  return {
    name,
    as,
    from,
  };
}

export function javaImport(from: string): Import {
  return {
    from,
  };
}
