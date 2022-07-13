export interface CodegenFile {
  readonly name: string;
  readonly contents: string;
  readonly templates: Templates;
  readonly isUnsigned: boolean;
  readonly nochange?: boolean;
}

export type Templates = {
  signature: string;
  startManual: string;
  endManual: string;
};

export const algolTemplates = {
  signature: '// SIGNED-SOURCE: <>',
  startManual: '// BEGIN-MANUAL-SECTION: []',
  endManual: '// END-MANUAL-SECTION',
};

export const sqlTemplates = {
  signature: '-- SIGNED-SOURCE: <>',
  startManual: '-- BEGIN-MANUAL-SECTION: []',
  endManual: '-- END-MANUAL-SECTION',
};

export const hashTemplates = {
  signature: '# SIGNED-SOURCE: <>',
  startManual: '# BEGIN-MANUAL-SECTION: []',
  endManual: '# END-MANUAL-SECTION',
};
