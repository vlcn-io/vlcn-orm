'strict';
import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { Mutation, MutationArgDef, mutationFn, MutationVerb } from '@aphro/mutation-grammar';
import { typeDefToTsType, TypescriptFile, importsToString } from '@aphro/codegen-ts';
// TODO: tsImport should probably go into `codegen-ts`
import { tsImport, nodeFn } from '@aphro/schema';
// TODO: Import should probably go into `codegen-api`?
import { Import } from '@aphro/schema-api';

function collectImportsForArgs(
  schema: SchemaNode | SchemaEdge,
  args: { [key: string]: MutationArgDef },
): Import[] {
  const fullArgsDefs = Object.values(args).map(a =>
    mutationFn.transformMaybeQuickToFull(schema, a),
  );
  return fullArgsDefs.flatMap(a =>
    a.typeDef
      .flatMap(td => {
        if (td.type === 'type') {
          if (typeof td.name === 'string' && td.name !== 'null') {
            return [
              tsImport(td.name, null, `./${td.name}.js`),
              tsImport('{Data}', td.name + 'Data', `./${td.name}.js`),
            ];
          } else if (typeof td.name !== 'string') {
            if (td.name == null) {
              throw new Error(
                `Bad arg type def received from ${schema.name} ${JSON.stringify(td)}`,
              );
            }
            if (td.name.type === 'id') {
              return [tsImport(td.name.of, null, `./${td.name.of}.js`)];
            }
            // else if (td.name.type === 'array') {
            // } else if (td.name.type === 'map') {
            // }
          }
        }
      })
      .filter((td): td is Import => td != null),
  );
}

export function collectImportsForMutations(schema: SchemaNode | SchemaEdge): Import[] {
  return Object.values(schema.extensions.mutations?.mutations || {}).flatMap(m =>
    collectImportsForArgs(schema, m.args),
  );
}

export function getArgNameAndType(
  schema: SchemaNode | SchemaEdge,
  args: { [key: string]: MutationArgDef },
  desturcture: boolean = true,
): [string, string] {
  const fullArgsDefs = Object.values(args).map(a =>
    mutationFn.transformMaybeQuickToFull(schema, a),
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
