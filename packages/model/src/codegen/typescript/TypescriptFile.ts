import { CodegenFile, ALGOL_TEMPLATE, sign } from "../CodegenFile.js";
// @ts-ignore
import prettier from "prettier";

export default class TypescriptFile implements CodegenFile {
  #contents: string;

  constructor(public readonly name: string, contents: string) {
    this.#contents = contents;
  }

  get contents(): string {
    return sign(
      prettier.format(this.#contents, { parser: "typescript" }),
      ALGOL_TEMPLATE
    );
  }
}
