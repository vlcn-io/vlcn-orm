import { Field, FieldType } from './Field.js';
import { Edge, FieldEdge } from './Edge.js';
import stripSuffix from '../utils/stripSuffix.js';
import AphroditeIntegration from '../integrations/AphroditeIntegration.js';
import SchemaConfig from './SchemaConfig.js';
import assert from '../utils/assert.js';

let constructorAllowed: boolean = false;

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
export default class Schema {
  private _fields: { [key: string]: Field<FieldType> };
  private _edges: { [key: string]: Edge };
  private integrated = false;
  private _config = new SchemaConfig(this.constructor.name);
  private static instances: Map<typeof Schema, Schema> = new Map();

  // This should be private but cannot be due to TS issue mentioned on `get`
  public constructor() {
    // since we can't do a private constructor, enforce privacy at runtime.
    assert(
      constructorAllowed,
      'You must call Schema.get(), not new Schema',
    );
  }

  /* see https://github.com/microsoft/TypeScript/issues/5863 */
  static get<T extends typeof Schema>(this: T): InstanceType<T> {
    const existing = this.instances.get(this);
    if (existing) {
      // @ts-ignore
      return existing;
    }

    // This "lock" is safe due to the fact that constructors can never be async.
    // You may be thinking locks like this are safe even when invoking async
    // functions since JS is still single threaded. You'd be wrong.
    // One async invocation may acquire the lock then return, due to await.
    // Another may acquire and release the lock, due to having a conditional await.
    // The first asnyc invocation will now no longer hold the lock.
    // E.g., await Promise.all(first, thingWithConditionalAwait);
    constructorAllowed = true;
    const ret = (new this()) as InstanceType<T>;
    constructorAllowed = false;
    this.instances.set(this, ret);
    return ret;
  }

  protected fields(): { [key: string]: Field<FieldType> } {
    return {};
  };
  protected edges(): { [key: string]: Edge } {
    return {};
  };
  protected config(config: SchemaConfig): void { };

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
