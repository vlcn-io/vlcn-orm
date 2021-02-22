import assert from "../utils/assert.js";
import ClassConfig from "./ClassConfig.js";
import ModuleConfig from "./ModuleConfig.js";

export default class SchemaConfig {
  readonly module = new ModuleConfig();
  readonly class = new ClassConfig();

  private _description: string;

  constructor(private schemaName: string) { }

  description(desc: string): this {
    this._description = desc;
    return this;
  }

  getDescription(): string {
    assert(
      this._description != null,
      `${this.schemaName} must provide a description in the config method.`,
    );
    return this._description;
  }
}
