import ClassConfig from '../../schema/ClassConfig.js';
import Edge from '../../schema/Edge.js';
import Field from '../../schema/Field.js';
import Schema from '../../schema/Schema.js';
import SchemaConfig from '../../schema/SchemaConfig.js';
import SlideSchema from './SlideSchema.js';

export default class ComponentSchema extends Schema {
  config(config: SchemaConfig) {
    config.description('Represents a component that is placed on a slide');
  }

  fields() {
    return {
      id: Field.guid(),
      selected: Field.bool(),
      classes: Field.stringOf('CassClass'),
      style: Field.map(
        Field.stringOf('CssAttribute'),
        Field.stringOf('CssValue'),
      ),
    };
  }

  edges() {
    return {
      slide: Edge.field(SlideSchema),
    };
  }
}
