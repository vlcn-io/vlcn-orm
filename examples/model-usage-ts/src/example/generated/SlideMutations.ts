// SIGNED-SOURCE: <ee27970ad4c40f2c956965740eb92e0c>
class SlideMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Data, Slide>) {}

  static for(model?: Slide) {
    if (model) {
      return new SlideMutations(new UpdateMutationBuilder(model));
    }
    return new SlideMutations(new CreateMutationBuilder());
  }

  create(deck: Deck, order: number): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  reorder(order: number): this {
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
