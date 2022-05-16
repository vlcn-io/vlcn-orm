// SIGNED-SOURCE: <79396eebc24362fc504d38aede953667>
import { ICreateOrUpdateBuilder } from "@aphro/mutator-runtime-ts";
import Todo from "./Todo.js";
import { default as spec } from "./TodoSpec.js";
import { Data } from "./Todo.js";
import { UpdateMutationBuilder } from "@aphro/mutator-runtime-ts";
import { CreateMutationBuilder } from "@aphro/mutator-runtime-ts";

export default class TodoMutations {
  constructor(private mutator: ICreateOrUpdateBuilder<Todo, Data>) {}

  static for(model?: Todo) {
    if (model) {
      return new TodoMutations(new UpdateMutationBuilder(spec, model));
    }
    return new TodoMutations(new CreateMutationBuilder(spec));
  }

  create(text: string): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
