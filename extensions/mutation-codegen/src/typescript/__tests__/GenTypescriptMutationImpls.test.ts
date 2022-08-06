import { createCompiler } from '@aphro/schema';
import mutationExtension from '@aphro/mutation-grammar';
import { GenTypescriptMutationImpls } from '../GenTypescriptMutationImpls.js';
import { SchemaNode } from '@aphro/schema-api';

const grammarExtensions = [mutationExtension];
const { compileFromString } = createCompiler({ grammarExtensions });

const noMutations = `Foo as Node {}`;
const emptyMutations = `Foo as Node {} & Mutations {}`;
const basic = `Foo as Node {} & Mutations {
  edit as Update {
    name: string
    age: number
    floaty: float
  }
}`;

test('No mutations', async () => {
  expect(GenTypescriptMutationImpls.accepts(compileIt(noMutations))).toBe(false);
});

test('Empty mutations', async () => {
  expect(GenTypescriptMutationImpls.accepts(compileIt(emptyMutations))).toBe(false);
});

test('Generating a basic file', async () => {
  const file = await genIt(compileIt(basic));
  expect(file.contents).toEqual(`import { EditArgs } from "./generated/FooMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Foo.js";
import Foo from "./Foo.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function editImpl(
  mutator: Omit<IMutationBuilder<Foo, Data>, "toChangeset">,
  { name, age, floaty }: EditArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation edit for schema Foo in FooMutationsImpl.ts"
  );
}
`);
});

// test('Generating over previously existing file', () => {});

async function genIt(schema: SchemaNode) {
  return await new GenTypescriptMutationImpls({
    nodeOrEdge: schema,
    edges: {},
    dest: '',
  }).gen();
}

function compileIt(schema: string) {
  return compileFromString(schema)[1].nodes.Foo;
}
