#!/usr/bin/env node

// @ts-ignore
import commandLineArgs from 'command-line-args';
// @ts-ignore
import commandLineUsage from 'command-line-usage';

import { CodegenPipeline } from '@aphro/codegen';
import * as process from 'process';
import * as path from 'path';
import { createCompiler, stopsCodegen } from '@aphro/schema';
import { SchemaEdge, SchemaNode, SchemaFile, ValidationError } from '@aphro/schema-api';
import chalk from 'chalk';

// TODO: core codegen should not depend on plugins!
import mutationExtension from '@aphro/mutation-grammar';
import graphqlExtension from '@aphro/graphql-grammar';
import { GenTypescriptMutationImpls, GenTypescriptMutations } from '@aphro/mutation-codegen';
import { GlobalStep, Step } from '@aphro/codegen-api';

import {
  GenSchemaExports,
  GenSQLExports,
  GenSQLExports_node,
  GenTypescriptModel,
  GenTypescriptModelManualMethodsClass,
  GenTypescriptQuery,
  GenTypescriptSpec,
  GenTypes_d_ts,
} from '@aphro/codegen-ts';
import { GenSqlTableSchema } from '@aphro/codegen-sql';
import { GenGraphQLTypedefs, GenGraphQLTypescriptResolvers } from '@aphro/graphql-codegen';

const grammarExtensions = [mutationExtension, graphqlExtension];

const steps: readonly Step[] = [
  GenTypescriptModel,
  GenTypescriptModelManualMethodsClass,
  GenTypescriptQuery,
  GenTypescriptSpec,
  GenTypescriptMutations,
  GenTypescriptMutationImpls,
  GenSqlTableSchema,
];

const globalSteps: readonly GlobalStep[] = [
  GenGraphQLTypedefs,
  GenGraphQLTypescriptResolvers,
  GenSchemaExports,
  GenSQLExports,
  GenSQLExports_node,
  GenTypes_d_ts,
];

async function run() {
  let color = chalk.blue;
  //   console.log(
  //     color(
  //       `Note: if you've migrated from v < 0.3 to v >= 0.3 you'll notice changes in codegen.

  // 1. Fully generated files have moved to a \`generated\` subdirectory
  // 2. Files that allow manual modification are in the root output dir

  // You'll want to delete all previously generated code if this is your first time on v0.3 or greater.
  // `,
  //     ),
  //   );

  const mainDefinitions = [{ name: 'gen', defaultOption: true }];
  const mainOptions = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
  });
  const argv = mainOptions._unknown || [];

  if (mainOptions.gen === 'gen') {
    const genDefinitions = [
      { name: 'src', alias: 's', defaultOption: true, multiple: true },
      { name: 'dest', alias: 'd' },
    ];
    const genOptions = commandLineArgs(genDefinitions, { argv });

    if (Object.keys(genOptions).length === 0 || !genOptions.src || !genOptions.dest) {
      print_gen_help();
      return;
    }

    const { compile } = createCompiler({ grammarExtensions });
    const errorsAndFiles: [ValidationError[], SchemaFile, string][] = genOptions.src.map(
      (s: string) => [...compile(path.join(process.cwd(), s)), s],
    );

    let hadFatal = false;
    errorsAndFiles.forEach(([errors, _, path]) => {
      reportErrors(errors, path);
      if (errors.some(stopsCodegen)) {
        hadFatal = true;
      }
    });

    if (hadFatal) {
      return;
    }

    const nodeSchemas: { [key: string]: SchemaNode } = errorsAndFiles.reduce(
      (l: { [key: string]: SchemaNode }, r) => {
        for (const [key, val] of Object.entries(r[1].nodes)) {
          if (l[key] != null) {
            throw new Error(`Node "${key}" was defined twice. Second definition in ${r[2]}`);
          }
          l[key] = val;
        }
        return l;
      },
      {},
    );

    const edgeSchemas: { [key: string]: SchemaEdge } = errorsAndFiles.reduce(
      (l: { [key: string]: SchemaEdge }, r) => {
        for (const [key, val] of Object.entries(r[1].edges)) {
          if (l[key] != null) {
            throw new Error(`Edge "${key}" was defined twice. Second definition in ${r[2]}`);
          }
          l[key] = val;
        }
        return l;
      },
      {},
    );

    // const schemas = schemaModules.map((s) => (<SchemaModule>s).default.get());
    const pipeline = new CodegenPipeline(steps, globalSteps);
    await pipeline.gen(nodeSchemas, edgeSchemas, genOptions.dest);

    return;
  }

  print_general_usage();
}

function reportErrors(errors: ValidationError[], filePath: string) {
  errors.forEach(e => {
    let color;
    switch (e.severity) {
      case 'advice':
        color = chalk.blue;
        break;
      case 'warning':
        color = chalk.yellow;
      case 'error':
        color = chalk.red;
    }
    console.log(color(e.message));
  });
}

function print_general_usage() {
  const sections = [
    {
      header: '🧚‍♀️ Aphrodite 🧚‍♀️',
      content: 'Utility to interact with Aphrodite Schemas',
    },
    {
      header: 'Synopsis',
      content: '{bold $ aphrodite} <command> <options>',
    },
    {
      header: 'Commands',
      content: [
        {
          name: '{bold gen}',
          summary: 'Generate the code from input schema(s) 🚀',
        },
      ],
    },
    {
      content: 'Project home: {underline https://github.com/tantaman/aphrodite}',
    },
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
}

function print_gen_help() {
  const usage = commandLineUsage([
    {
      header: 'Aphrodite `gen`',
      content: 'Generates code based on input schema(s)',
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'src',
          type: String,
          multiple: true,
          defaultOption: true,
          typeLabel: '{underline schema} ...',
          description: 'Schemas to process',
          alias: 's',
        },
        {
          name: 'dest',
          description: 'Directory to write generated code to',
          type: String,
          typeLabel: '{underline dir}',
          alias: 'd',
        },
      ],
    },
  ]);

  console.log(usage);
}

run().catch(e => console.log(e));
