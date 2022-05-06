// SIGNED-SOURCE: <b99750e12dbb708a7a622941d023b786>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import User from "./User.js";
import { default as spec } from "./UserSpec.js";
import { Data } from "./User.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";

export default class UserMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<User, Data>) {}

  static for(model?: User) {
    if (model) {
      return new UserMutations(new UpdateMutationBuilder(spec, model));
    }
    return new UserMutations(new CreateMutationBuilder(spec));
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
