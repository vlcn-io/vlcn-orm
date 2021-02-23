import Schema from '../../schema/Schema.js';
import Edge from '../../schema/Edge.js';
import ComponentSchema from './ComponentSchema.js';
import Field from '../../schema/Field.js';
import DeckSchema from './DeckSchema.js';
import TypeGraphQL from '../../integrations/type_graphql/TypeGraphQL.js';
import SchemaConfig from '../../schema/SchemaConfig.js';

export default class SlideSchema extends Schema {
  config(config: SchemaConfig) {
    config.description('Represents a single slide within a deck');
  }

  edges() {
    return {
      components: Edge.foreignKey(ComponentSchema, "slide"),
      deck: Edge.field(DeckSchema),
    };
  }

  fields() {
    return {
      id: Field.id.guid(),
      selected: Field.bool(),
      focused: Field.bool(),
      classes: Field.stringOf('CssClass'),
      style: Field.map(
        Field.stringOf('CssAttribute'),
        Field.stringOf('CssValue'),
      ),
      deckId: Field.id.int(),
    };
  }

  integrations() {
    return [
      TypeGraphQL()
        .expose([
          'id',
          'selected',
          'focused',
          'classes',
        ]),
    ];
  }
}
