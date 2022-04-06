import { sign, ALGOL_TEMPLATE, extractSignature } from "../CodegenFile.js";
import md5 from "md5";

test("Signing source", () => {
  const content = "foo";
  const signed = sign(content, "<>");
  const hash = md5(content);
  expect(signed).toEqual(`<${hash}>\n${content}`);
});

test("Check signature", () => {
  const content = "foo";
  const hash = md5(content);
  const signed = sign(content, "<>");
  expect(extractSignature(signed, "<>")).toBe(hash);
});
