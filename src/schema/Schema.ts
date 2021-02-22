import { Field, FieldType } from './Field.js';
import { Edge, FieldEdge } from './Edge.js';
import stripSuffix from '../utils/stripSuffix.js';
import AphroditeIntegration from '../integrations/AphroditeIntegration.js';
import SchemaConfig from './SchemaConfig.js';

/*
* TODO: Schema seems to be handling three concerns:
* 1. Allowing subclasses to configure details (via protected methods)
* 2. Representing configuration to our build system (via getters)
* 3. Applying integrations to update the existing schema
*
* Can we tease these apart?
* 1. Schema is a thing for users to extend and provide schema information
* 2. "IntegratedSchema" (some better name) represents the final schema, for use by build system, after integrations are applied
*/
export default abstract class Schema {
  private _fields: { [key: string]: Field<FieldType> };
  private _edges: { [key: string]: Edge };
  private integrated = false;
  private _config = new SchemaConfig(this.constructor.name);

  protected abstract fields(): { [key: string]: Field<FieldType> };
  protected abstract edges(): { [key: string]: Edge };
  protected abstract config(config: SchemaConfig): void;

  protected integrations(): AphroditeIntegration[] {
    return [];
  }

  private integrate() {
    if (this.integrated === true) {
      return;
    }
    this.integrated = true;

    this.config(this._config);
    this._fields = this.fields();
    this._edges = this.edges();
    Object.entries(this._edges).forEach(
      ([key, edge]) => edge.name = key,
    );

    this.integrations().forEach(i => {
      i.applyTo(this);
    });
  }

  getFields(): { [key: string]: Field<FieldType> } {
    this.integrate();
    return this._fields;
  }

  getEdges(): { [key: string]: Edge } {
    this.integrate();
    return this._edges;
  }

  getConfig(): SchemaConfig {
    this.integrate();
    return this._config;
  }

  getModelTypeName() {
    return stripSuffix(
      this.constructor.name,
      'Schema',
    ).expect('Schema names must end in "Schema"');
  }

  getMutatorTypeName() {
    return this.getModelTypeName() + 'Mutator';
  }

  getQueryTypeName() {
    return this.getModelTypeName() + 'Query';
  }
}
