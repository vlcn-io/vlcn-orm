#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import CodegenPipleine from "./codegen/CodegenPipeline.js";
import * as process from "process";
import * as path from "path";
import compile from "./schema/v2/compile.js";
import { stopsCodegen, ValidationError } from "./schema/v2/validate.js";
import { SchemaFile } from "schema/parser/SchemaType.js";
import chalk from "chalk";

async function run() {
  const mainDefinitions = [{ name: "gen", defaultOption: true }];
  const mainOptions = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
  });
  const argv = mainOptions._unknown || [];

  if (mainOptions.gen === "gen") {
    const genDefinitions = [
      { name: "src", alias: "s", defaultOption: true, multiple: true },
      { name: "dest", alias: "d" },
    ];
    const genOptions = commandLineArgs(genDefinitions, { argv });

    if (
      Object.keys(genOptions).length === 0 ||
      !genOptions.src ||
      !genOptions.dest
    ) {
      print_gen_help();
      return;
    }

    const errorsAndFiles: [ValidationError[], SchemaFile, string][] =
      genOptions.src.map((s: string) => [
        ...compile(path.join(process.cwd(), s)),
        s,
      ]);

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

    const nodeSchemas = errorsAndFiles.flatMap(([_, file]) =>
      Object.values(file.nodes)
    );

    // edgeSchemas

    // and.. map of all the things that were imported and referenced.

    // const schemas = schemaModules.map((s) => (<SchemaModule>s).default.get());
    const pipeline = new CodegenPipleine();
    await pipeline.gen(nodeSchemas, genOptions.dest);

    return;
  }

  print_general_usage();
}

function reportErrors(errors: ValidationError[], filePath: string) {
  errors.forEach((e) => {
    let color;
    switch (e.severity) {
      case "advice":
        color = chalk.blue;
        break;
      case "warning":
        color = chalk.yellow;
      case "error":
        color = chalk.red;
    }
    console.log(color(e.message));
  });
}

function print_general_usage() {
  const sections = [
    {
      header: "🧚‍♀️ Aphrodite 🧚‍♀️",
      content: "Utility to interact with Aphrodite Schemas",
    },
    {
      header: "Synopsis",
      content: "{bold $ aphrodite} <command> <options>",
    },
    {
      header: "Commands",
      content: [
        {
          name: "{bold gen}",
          summary: "Generate the code from input schema(s) 🚀",
        },
      ],
    },
    {
      content:
        "Project home: {underline https://github.com/tantaman/aphrodite}",
    },
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
}

function print_gen_help() {
  const usage = commandLineUsage([
    {
      header: "Aphrodite `gen`",
      content: "Generates code based on input schema(s)",
    },
    {
      header: "Options",
      optionList: [
        {
          name: "src",
          type: String,
          multiple: true,
          defaultOption: true,
          typeLabel: "{underline schema} ...",
          description: "Schemas to process",
          alias: "s",
        },
        {
          name: "dest",
          description: "Directory to write generated code to",
          type: String,
          typeLabel: "{underline dir}",
          alias: "d",
        },
      ],
    },
  ]);

  console.log(usage);
}

run().catch((e) => console.log(e));
