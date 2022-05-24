export interface CodegenFile {
  readonly name: string;
  readonly contents: string;
  readonly signatureTemplate: string;
}

export const ALGOL_TEMPLATE = '// SIGNED-SOURCE: <>';
export const SQL_TEMPLATE = '-- SIGNED-SOURCE: <>';
export const HASH_TEMPLATE = '# SIGNED-SOURCE: <>';

export const ALGOL_BEGIN_MANUAL_SECTION_MARKER = '// BEGIN-MANUAL-SECTION: []';
export const ALGOL_END_MANUAL_SECTION_MARKER = '// END-MANUAL-SECTION';
