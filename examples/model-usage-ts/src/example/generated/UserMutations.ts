// SIGNED-SOURCE: <99d0a20dc230c737073c168d0ea0da9b>
class UserMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Data, User>) {}

  static for(model?: User) {
    if (model) {
      return new UserMutations(new UpdateMutationBuilder(model));
    }
    return new UserMutations(new CreateMutationBuilder());
  }

  create(name: string): this {
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
