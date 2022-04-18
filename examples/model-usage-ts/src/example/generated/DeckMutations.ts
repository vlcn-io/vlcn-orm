// SIGNED-SOURCE: <f53380c2d2374620608fe2ac7d6a1193>
class DeckMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Data, Deck>) {}

  static for(model?: Deck) {
    if (model) {
      return new DeckMutations(new UpdateMutationBuilder(model));
    }
    return new DeckMutations(new CreateMutationBuilder());
  }

  create(name: string, owner: User, selectedSlide: Slide | null): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  selectSlide(selectedSlide: Slide): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  rename(name: string): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  delete(): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
