// SIGNED-SOURCE: <d280feb85a680fb5dc33411a18967ed4>
import {
  DerivedQuery,
  QueryFactory,
  modelLoad,
  filter,
  Predicate,
  P,
  ModelFieldGetter,
} from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import TextComponent, { Data, spec } from "./TextComponent.js";
import TextComponent from "./TextComponent.js";

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
