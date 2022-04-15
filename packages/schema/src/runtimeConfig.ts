import { GrammarExtension } from '@aphro/grammar-extension-api';
import { Step } from '@aphro/codegen-api';

export type Config = {
  grammarExtensions?: GrammarExtension<any, any>[];
  codegenExtensions?: Step[];
};
