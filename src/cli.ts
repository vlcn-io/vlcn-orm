import { parse } from 'ts-command-line-args';

const commandDefinition = [
  { name: 'command', defaultOption: true }
];
const command = parse(commandDefinition, { stopAtFirstUnknown: true });

console.log(command);

// interface Arguments {
//   source: string,
// }
