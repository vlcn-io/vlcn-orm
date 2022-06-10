import * as ts from 'typescript';

export function extractImports(file: ts.SourceFile) {
  const imports: ts.Node[] = [];
  file.forEachChild(c => {
    if (c.kind === ts.SyntaxKind.ImportClause) {
      imports.push(c);
    }
  });

  return imports;
}
