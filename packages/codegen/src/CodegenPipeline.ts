import { maybeMap } from '@strut/utils';
import * as fs from 'fs';
import * as path from 'path';
import { Node, Edge } from '@aphro/schema-api';
import { CodegenFile, Step } from '@aphro/codegen-api';
import { checkSignature } from './CodegenFile.js';

export default class CodegenPipleine {
  constructor(private readonly steps: readonly Step[]) {}

  async gen(schemas: (Node | Edge)[], dest: string) {
    const files = schemas.flatMap(schema =>
      maybeMap(this.steps, step => (!step.accepts(schema) ? null : new step(schema).gen())),
    );

    await fs.promises.mkdir(dest, { recursive: true });
    await this.checkHashes(dest, files);
    await Promise.all(
      files.map(async f => await fs.promises.writeFile(toPath(dest, f.name), f.contents)),
    );
  }

  private async checkHashes(dest: string, files: CodegenFile[]) {
    await Promise.all(
      files.map(async f => {
        try {
          const contents = await fs.promises.readFile(toPath(dest, f.name), { encoding: 'utf8' });
          checkSignature(contents, f.signatureTemplate);
        } catch (e) {
          if (e.code === 'bad-signature') {
            throw new Error(
              `Signature for ${toPath(
                dest,
                f.name,
              )} did not match its contents. Was the file manually modified after code-gen?`,
            );
          }
          // The file not existing is an ok case.
          // Maybe codegen hasn't been run previously.
          if (e.code !== 'ENOENT') {
            throw e;
          }
        }
      }),
    );
  }
}

function toPath(folder: string, fname: string) {
  return path.join(folder, fname);
}
