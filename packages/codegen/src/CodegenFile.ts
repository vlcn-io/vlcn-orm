import md5 from "md5";

export interface CodegenFile {
  readonly name: string;
  readonly contents: string;
}

export const ALGOL_TEMPLATE = "// SIGNED-SOURCE: <>";
export const SQL_TEMPLATE = "-- SIGNED-SOURCE: <>";
export const HASH_TEMPLATE = "# SIGNED-SOURCE: <>";

export function sign(content: string, template: string) {
  return `${template.replace("<>", "<" + md5(content) + ">\n")}${content}`;
}

export function extractSignature(content: string, template: string): string {
  const templateReg = new RegExp(template.replace("<>", "<([0-9a-f]+)>"));
  const firstLine = content.split("\n")[0];
  const result = templateReg.exec(firstLine);
  if (result) {
    return result[1];
  }

  throw new Error("Could not find signature for " + template + " " + firstLine);
}
