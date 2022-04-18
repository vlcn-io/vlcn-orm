import { maybeMap } from '@strut/utils';
import * as fs from 'fs';
import { Node, Edge } from '@aphro/schema-api';
import { Step } from '@aphro/codegen-api';

export default class CodegenPipleine {
  constructor(private readonly steps: readonly Step[]) {}

  async gen(schemas: (Node | Edge)[], dest: string) {
    const files = schemas.flatMap(schema =>
      maybeMap(this.steps, step => (!step.accepts(schema) ? null : new step(schema).gen())),
    );

    await Promise.all(
      files.map(async f => await fs.promises.writeFile(dest + '/' + f.name, f.contents)),
    );
  }
}
