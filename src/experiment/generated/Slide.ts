import Model from '@aphrodite-runtime/Model.js';
import { Field, ObjectType, Int, Float, ID } from 'type-graphql'
@ObjectType({ description: "Represents a single slide within a deck" })
export default class Slide
  extends Model<{
    id: string,
    selected: boolean,
    focused: boolean,
    classes: string,
    style: Map<string, string>
  }> {
  @Field(type => ID)
  getId(): string {
    return this.data.id;
  }

  @Field(type => Boolean)
  getSelected(): boolean {
    return this.data.selected;
  }

  @Field(type => Boolean)
  getFocused(): boolean {
    return this.data.focused;
  }

  @Field(type => String)
  getClasses(): string {
    return this.data.classes;
  }


  getStyle(): Map<string, string> {
    return this.data.style;
  }

  queryComponents(): ComponentQuery {
    return ComponentQuery.fromForeignId(
      this.getId(), 'slide'
    );
  }

  queryDeck(): DeckQuery {
    return DeckQuery.fromId(
      this.getDeckId()
    );
  }

}
