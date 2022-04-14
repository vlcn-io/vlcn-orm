import { ValidationError } from '@aphro/schema-api';

export interface GrammarExtension<TAst, TCondensed> {
  grammar(): string;
  actions(): { [key: string]: Function };
  condensor(ast: TAst): [ValidationError[], TCondensed];
}
