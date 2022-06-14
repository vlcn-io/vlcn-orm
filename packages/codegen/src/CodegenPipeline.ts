import * as fs from 'fs';
import * as path from 'path';
import { Node, Edge } from '@aphro/schema-api';
import { CodegenFile, GlobalStep, Step } from '@aphro/codegen-api';
import {
  checkSignature,
  insertManualSections,
  readManualSections,
  removeManualSections,
} from './CodegenFile.js';

export default class CodegenPipleine {
  constructor(
    private readonly steps: readonly Step[],
    private readonly globalSteps: readonly GlobalStep[],
  ) {}

  async gen(nodes: Node[], edges: Edge[], dest: string) {
    let files = (
      await Promise.all(
        nodes.map(
          async schema =>
            await Promise.all(
              this.steps.map(
                async step => await (!step.accepts(schema) ? null : new step(schema, dest).gen()),
              ),
            ),
        ),
      )
    ).flatMap(f => f.filter((f): f is CodegenFile => f != null));

    const globalStepFiles = await Promise.all(
      this.globalSteps.map(step => new step(nodes, edges, 'domain.js').gen()),
    );

    files = files.concat(globalStepFiles);

    await fs.promises.mkdir(dest, { recursive: true });
    const toWrite = await this.checkHashesAndAddManualCode(dest, files);
    await Promise.all(
      toWrite.map(async f => await fs.promises.writeFile(toPath(dest, f[0]), f[1])),
    );
  }

  private async checkHashesAndAddManualCode(
    dest: string,
    files: CodegenFile[],
  ): Promise<[string, string][]> {
    return await Promise.all(
      files.map(async f => {
        if (f.isUnsigned) {
          return [f.name, f.contents];
        }
        try {
          const contents = await fs.promises.readFile(toPath(dest, f.name), { encoding: 'utf8' });
          try {
            checkSignature(contents, f.templates);
          } catch (e) {
            console.error('Fatal on file: ' + f.name);
            throw e;
          }

          const manualInsertions = readManualSections(contents, f.templates);
          if (manualInsertions.size > 0) {
            return [
              f.name,
              insertManualSections(
                // We remove manual sections from the generated code because the code-generator may have
                // generated comments into manual sections. If they did that but the file already exists,
                // use the user's manual sections rather than our own generated manual sections.
                removeManualSections(f.contents, f.templates),
                manualInsertions,
                f.templates,
              ),
            ];
          }
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

        return [f.name, f.contents];
      }),
    );
  }
}

function toPath(folder: string, fname: string) {
  return path.join(folder, fname);
}
