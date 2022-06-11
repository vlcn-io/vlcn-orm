// @ts-ignore
import ts from 'typescript';
import { filter } from './nodeChildren.js';

// non complete implementation of export extraction.
// meets the current minimum bar for GenTypescriptMutationImpls
export function exports(file: ts.SourceFile) {
  return filter(file, (n): n is ts.FunctionDeclaration => {
    switch (n.kind) {
      case ts.SyntaxKind.FunctionDeclaration:
        const modifiers = n.modifiers;
        if (modifiers == null || modifiers[0] == null) {
          return false;
        }

        return modifiers[0].kind === ts.SyntaxKind.ExportKeyword;
    }

    return false;
  });
}

export function imports(file: ts.SourceFile): ts.ImportDeclaration[] {
  const x = [];
  // x.filter();
  return filter(file, (n): n is ts.ImportDeclaration => {
    return n.kind === ts.SyntaxKind.ImportDeclaration;
  });
}
