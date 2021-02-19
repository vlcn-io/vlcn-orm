import Schema from '../Schema';
import Edge from '../Edge';
import ComponentSchema from './ComponentSchema';
import Field from '../Field';

export default class SlideSchema extends Schema {
  edges() {
    return {
      components: Edge.oneToMany(ComponentSchema),
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
