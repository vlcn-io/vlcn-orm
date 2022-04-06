export interface CodegenFile {
  readonly name: string;
  readonly contents: string;
}

export const ALGOL_TEMPLATE = "// SIGNED-SOURCE: <>";
export const SQL_TEMPLATE = "-- SIGNED-SOURCE: <>";
export const HASH_TEMPLATE = "# SIGNED-SOURCE: <>";
