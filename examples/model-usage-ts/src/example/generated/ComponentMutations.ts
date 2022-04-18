// SIGNED-SOURCE: <b6de8ddd903ce3fb2542cea97592675c>
class ComponentMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Data, Component>) {}

  static for(model?: Component) {
    if (model) {
      return new ComponentMutations(new UpdateMutationBuilder(model));
    }
    return new ComponentMutations(new CreateMutationBuilder());
  }

  create(subtype: "Text" | "Embed", slide: Slide, content: string): this {
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
