import { createCompiler } from '@aphro/schema';
import mutationExtension from '@aphro/mutation-grammar';
import { GenTypescriptMutationImpls } from '../GenTypescriptMutationImpls.js';

const grammarExtensions = [mutationExtension];
const { compileFromString } = createCompiler({ grammarExtensions });

const noMutations = `Foo as Node {}`;
const emptyMutations = `Food as Node {} & Mutations {}`;

test('No mutations', async () => {
  const out = await genIt(noMutations);
  console.log(out);
});

test('Empty mutations', async () => {
  const out = await genIt(emptyMutations);
  console.log(out);
});

test('Generating over previously existing file', () => {});

async function genIt(schema: string) {
  return await new GenTypescriptMutationImpls(compileFromString(schema)[1].nodes.Foo, '').gen();
}
