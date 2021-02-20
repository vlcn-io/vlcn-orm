import Schema from '../../schema/Schema';
import Edge from '../../schema/Edge';
import ComponentSchema from './ComponentSchema';
import Field from '../../schema/Field';

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
