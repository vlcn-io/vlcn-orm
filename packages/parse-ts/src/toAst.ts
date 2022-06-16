// @ts-ignore
import ts from 'typescript';

export function stringToAst(
  filename: string,
  fileContents: string,
  target: ts.ScriptTarget = 99, //ts.ScriptTarget.Latest,
): ts.SourceFile {
  return ts.createSourceFile(filename, fileContents, target, true);
}
