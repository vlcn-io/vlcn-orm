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
      { name: 'file', defaultOption: true, multiple: true },
      { name: 'dest', alias: 'd' },
    ]
    const genOptions = commandLineArgs(genDefinitions, { argv });
    console.log(genOptions);
  } else {
    print_general_usage();
  }
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
    }
  ]
  const usage = commandLineUsage(sections)
  console.log(usage)
}

try {
  run();
} catch (e) {
  console.log(e);
}
