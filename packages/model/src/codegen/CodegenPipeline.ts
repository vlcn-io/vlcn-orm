import { maybeMap } from "@strut/utils";
import CodegenStep from "./CodegenStep.js";
import GenTypescriptModel from "./typescript/GenTypescriptModel.js";
import * as fs from "fs";
import GenTypescriptQuery from "./typescript/GenTypescriptQuery.js";
import GenMySqlTableSchema from "./mysql/GenMySQLTableSchema.js";
import GenPostgresTableSchema from "./postgres/GenPostgresTableSchema.js";
import { Node, Edge } from "../schema/parser/SchemaType.js";

type Step = {
  new (x: Node | Edge): CodegenStep;
  accepts: (x: Node | Edge) => boolean;
};

const defaultSteps: readonly Step[] = [
  GenTypescriptModel,
  GenTypescriptQuery,
  GenMySqlTableSchema,
  GenPostgresTableSchema,
];

export default class CodegenPipleine {
  constructor(private readonly steps: readonly Step[] = defaultSteps) {}

  async gen(schemas: (Node | Edge)[], dest: string) {
    const files = schemas.flatMap((schema) =>
      maybeMap(this.steps, (step) =>
        !step.accepts(schema) ? null : new step(schema).gen()
      )
    );

    await Promise.all(
      files.map(
        async (f) =>
          await fs.promises.writeFile(dest + "/" + f.name, f.contents)
      )
    );
  }
}
