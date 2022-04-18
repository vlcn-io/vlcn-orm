import { ValidationError } from '@aphro/schema-api';
import { ActionDict } from 'ohm-js';

type RuleName = string;
interface ExtensionPoints {
  NodeFunction?: RuleName;
  EdgeFunction?: RuleName;
  // eventually fields too
  // and... extensions of extensions? e.g., auth on mutations...

  // should we just invert control instead?
  // make a pipeline where each stage of the pipeline augments
  // the parser...
  //
  // and provide utils to do so.
  //
  // this'll make extensions of extensions easier to implement.
  // or... we can just do it this way and one can register an
  // extension point when they add their extension...
  //
  // declare module, interface extension trick...
}

export interface GrammarExtension<TAst, TCondensed> {
  readonly name: string; //Symbol;
  readonly extends: ExtensionPoints;

  grammar(): string;
  actions(): ActionDict<any>;
  condensor(ast: TAst): [ValidationError[], TCondensed];
}
