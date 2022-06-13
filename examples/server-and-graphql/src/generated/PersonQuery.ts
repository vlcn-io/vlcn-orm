// SIGNED-SOURCE: <c6eaef974727281a5b168f79e91f9f34>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Person from "./Person.js";
import { Data } from "./Person.js";
import { default as spec } from "./PersonSpec.js";
import { default as PlayerSpec } from "./PlayerSpec.js";
import PlayerQuery from "./PlayerQuery.js";

export default class PersonQuery extends DerivedQuery<Person> {
  static create(ctx: Context) {
    return new PersonQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Person>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new PersonQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, Person>("id"), p)
    );
  }

  whereToken(p: Predicate<Data["token"]>) {
    return new PersonQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"token", Data, Person>("token"), p)
    );
  }
  queryPlaying(): PlayerQuery {
    return new PlayerQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.playing
      ),
      modelLoad(this.ctx, PlayerSpec.createFrom)
    );
  }
}
