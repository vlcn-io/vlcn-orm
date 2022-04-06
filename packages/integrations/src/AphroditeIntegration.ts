import { Node } from "../schema/parser/SchemaType.js";

export default interface AphroditeIntegration {
  applyTo(schema: Node): void;
}
