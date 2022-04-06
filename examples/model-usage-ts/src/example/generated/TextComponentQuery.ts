// SIGNED-SOURCE: <2bd12623181060b5ca34bde78511f35e>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
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
