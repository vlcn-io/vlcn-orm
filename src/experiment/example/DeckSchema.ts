import Field from '../../schema/Field.js';
import Edge from '../../schema/Edge.js';
import Schema from '../../schema/Schema.js';
import SlideSchema from './SlideSchema.js';
import SchemaConfig from '../../schema/SchemaConfig.js';

export default class DeckSchema extends Schema {
  config(config: SchemaConfig) {
    config.description('Represents a deck of slides');
  }

  fields() {
    return {
      id: Field.guid(),
      title: Field.stringOf('string'),
    };
  }

  edges() {
    return {
      slides: Edge.foreignKey(SlideSchema, "deck"),
    };
  }
}

/*
What will this generate?

1. Classes to interact with these things
2. Mutators to modify them

How will loading and storage work?

Generate different backends?
Localized storage.

Maybe can still use Apollo:
https://medium.com/front-end-weekly/implementing-graphql-api-in-the-browser-9fc8dec68a5d

and we can occasionally scoop up our model to send to server.
Since we want to persist differently than apollo.

Or we can batch link and provide a key of the given component id + mutation type
to debounce / batch move mutations:
https://www.apollographql.com/docs/react/api/link/apollo-link-batch-http/
*/
