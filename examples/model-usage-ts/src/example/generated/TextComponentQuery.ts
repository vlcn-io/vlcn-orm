// SIGNED-SOURCE: <ae39baafcd5b06394e070276ada00e67>
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import TextComponent from "./TextComponent.js";
import { Data } from "./TextComponent.js";
import { default as spec } from "./TextComponentSpec.js";

export default class TextComponentQuery extends DerivedQuery<TextComponent> {
  static create() {
    return new TextComponentQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<TextComponent>) {
    return this.create().whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new TextComponentQuery(
      this,
      filter(new ModelFieldGetter<"id", Data, TextComponent>("id"), p)
    );
  }

  whereContent(p: Predicate<Data["content"]>) {
    return new TextComponentQuery(
      this,
      filter(new ModelFieldGetter<"content", Data, TextComponent>("content"), p)
    );
  }
}
