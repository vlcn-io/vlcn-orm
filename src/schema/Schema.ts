import { Field, FieldType } from './Field.js';
import { Edge, FieldEdge } from './Edge.js';
import stripSuffix from '../utils/stripSuffix.js';
import ModuleConfig from './ModuleConfig.js';
import AphroditeIntegration from '../integrations/AphroditeIntegration.js';

export default abstract class Schema {
  private _fields: {[key:string]: Field<FieldType>};
  private _edges: {[key:string]: Edge};
  private integrated = false;
  private moduleConfig = new ModuleConfig();

  protected abstract fields(): {[key:string]: Field<FieldType>};
  protected abstract edges(): {[key:string]: Edge};

  protected module(config: ModuleConfig): void {}
  protected integrations(): AphroditeIntegration[] {
    return [];
  }

  private integrate() {
    if (this.integrated === true) {
      return;
    }
    this.integrated = true;

    this.module(this.moduleConfig);

    this._fields = this.fields();
    this._edges = this.edges();
    Object.entries(this._edges).forEach(
      ([key, edge]) => edge.name = key,
    );

    this.integrations().forEach(i => {
      i.applyTo(this);
    });
  }

  getFields(): {[key:string]: Field<FieldType>} {
    this.integrate();
    return this._fields;
  }

  getEdges(): {[key:string]: Edge} {
    this.integrate();
    return this._edges;
  }

  getModuleConfig(): ModuleConfig {
    this.integrate();
    return this.moduleConfig;
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
