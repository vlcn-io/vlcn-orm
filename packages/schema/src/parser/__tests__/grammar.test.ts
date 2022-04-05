import { contents, ast } from "./testSchemaFile.js";
import grammar from "../ohm/grammar.js";

test("parsing a small schema", () => {
  const match = grammar.match(contents);
  expect(match.succeeded()).toBe(true);
});
