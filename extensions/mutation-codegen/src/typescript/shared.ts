'strict';
import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { Mutation, MutationArgDef, mutationFn, MutationVerb } from '@aphro/mutation-grammar';
import { typeDefToTsType, TypescriptFile, importsToString } from '@aphro/codegen-ts';
// TODO: tsImport should probably go into `codegen-ts`
import { tsImport, nodeFn } from '@aphro/schema';
// TODO: Import should probably go into `codegen-api`?
import { Import } from '@aphro/schema-api';

function collectImportsForArgs(schema: Node, args: { [key: string]: MutationArgDef }): Import[] {
  const fullArgsDefs = Object.values(args).map(a =>
    mutationFn.transformMaybeQuickToFull(schema, a),
  );
  return fullArgsDefs.flatMap(
    a =>
      a.typeDef
        .flatMap(td =>
          td.type === 'type'
            ? typeof td.name === 'string' && td.name !== 'null'
              ? [
                  tsImport(td.name, null, `./${td.name}.js`),
                  tsImport('{Data}', td.name + 'Data', `./${td.name}.js`),
                ]
              : null
            : null,
        )
        .filter(td => td != null) as Import[],
  );
}

export function collectImportsForMutations(schema: Node): Import[] {
  return Object.values(schema.extensions.mutations?.mutations || {}).flatMap(m =>
    collectImportsForArgs(schema, m.args),
  );
}

export function getArgNameAndType(
  args: { [key: string]: MutationArgDef },
  desturcture: boolean = true,
): [string, string] {
  const fullArgsDefs = Object.values(args).map(a =>
    mutationFn.transformMaybeQuickToFull(this.schema, a),
  );

  const type =
    '{' +
    fullArgsDefs
      .map(a => {
        return a.name + ': ' + typeDefToTsType(a.typeDef);
      })
      .join(',') +
    '}';
  let argName = 'args';
  if (desturcture) {
    argName = '{' + fullArgsDefs.map(a => a.name).join(',') + '}';
  }
  return [argName, type];
}
