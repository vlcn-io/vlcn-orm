import { parseString } from "../parse.js";
import { contents, ast } from "./testSchemaFile.js";

test("Parsing with the compiled grammar", () => {
  const parsed = parseString(contents);
  expect(parsed).toEqual(ast);
});
