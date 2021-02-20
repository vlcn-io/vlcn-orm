import Schema from '../../schema/Schema.js';
import Edge from '../../schema/Edge.js';
import ComponentSchema from './ComponentSchema.js';
import Field from '../../schema/Field.js';

export default class SlideSchema extends Schema {
  edges() {
    return {
      components: Edge.foreignKey('one_to_many', ComponentSchema),
    };
  }

  fields() {
    return {
      id: Field.guid(),
      selected: Field.bool(),
      focused: Field.bool(),
      classes: Field.stringOf('CssClass'),
      style: Field.map(
        Field.stringOf('CssAttribute'),
        Field.stringOf('CssValue'),
      ),
    };
  }
}
