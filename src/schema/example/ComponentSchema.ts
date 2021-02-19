import Field from '../Field';
import Schema from '../Schema';

export default class ComponentSchema extends Schema {
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
    return {};
  }
}
