#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

function run() {
  const mainDefinitions = [
    { name: 'gen', defaultOption: true }
  ]
  const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
  const argv = mainOptions._unknown || []

  if (mainOptions.gen === 'gen') {
    const genDefinitions = [
      { name: 'src', alias: 's', defaultOption: true, multiple: true },
      { name: 'dest', alias: 'd' },
    ]
    const genOptions = commandLineArgs(genDefinitions, { argv });

    if (Object.keys(genOptions).length === 0 || !genOptions.src || !genOptions.dest) {
      print_gen_help();
      return;
    }

    return;
  }

  print_general_usage();
}

function print_general_usage() {
  const sections = [
    {
      header: '🧚‍♀️ Aphrodite 🧚‍♀️',
      content: 'Utility to interact with Aphrodite Schemas'
    },
    {
      header: 'Synopsis',
      content: '{bold $ aphrodite} <command> <options>'
    },
    {
      header: 'Commands',
      content: [
        {
          name: '{bold gen}',
          summary: 'Generate the code from input schema(s) 🚀'
        },
      ]
    },
    {
      content: 'Project home: {underline https://github.com/tantaman/aphrodite}'
    }
  ]
  const usage = commandLineUsage(sections)
  console.log(usage)
}

function print_gen_help() {
  const usage = commandLineUsage([
    {
      header: 'Aphrodite `gen`',
      content: 'Generates code based on input schema(s)'
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
  ])

  console.log(usage)
}

try {
  run();
} catch (e) {
  console.log(e);
}
