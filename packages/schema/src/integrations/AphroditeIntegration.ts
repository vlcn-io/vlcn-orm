import Schema from "../schema/Schema";

export default interface AphroditeIntegration {
  applyTo(schema: Schema): void;
}
