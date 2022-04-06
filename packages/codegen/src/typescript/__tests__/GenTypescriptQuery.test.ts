import GenTypescriptModel from "../GenTypescriptModel.js";
import { Node } from "../../../schema/parser/SchemaType.js";
import { compileFromString } from "../../../schema/v2/compile.js";
import GenTypescriptQuery from "../GenTypescriptQuery";

const NoEdgesSchema = `
engine: postgres
db: test

Foo as Node {}
`;

const OutboundEdgeViaFieldSchema = `
engine: postgres
db: test

Foo as Node {
  barId: ID<Bar>
} & OutboundEdges {
  bar: Edge<Foo.barId>
}
`;

const OutboundThroughForeignFieldSchema = `
engine: postgres
db: test

Foo as Node {} & OutboundEdges {
  bars: Edge<Bar.fooId>
}
`;

const InboundOnFieldEdgeSchema = `
engine: postgres
db: test

Foo as Node {
  barId: ID<Bar>
} & InboundEdges {
  fromBar: Edge<Foo.barId>
}
`;

const InlineJunction = `
engine: postgres
db: test

Foo as Node {
} & OutboundEdges {
  bars: Edge<Bar>
}
`;

const BidiInlineJunction = `
engine: postgres
db: test

Foo as Node {
} & OutboundEdges {
  bars: Edge<Bar>
}

Bar as Node {
} & OutboundEdges {
  foos: InverseEdge<Foo.bar>
}
`;

const BidiNamedJunction = `
engine: postgres
db: test

Foo as Node {
} & OutboundEdges {
  bars: FooToBarEdge
}

Bar as Node {
} & OutboundEdges {
  foos: BarToFooEdge
}

FooToBarEdge as Edge<Foo, Bar> {}
BarToFooEdge as InverseEdge<FooToBarEdge> {}
`;

const InboundThroughLocalFieldSchema = ``;

test("NoEdgesSchema", () => {
  const contents = genIt(
    compileFromString(NoEdgesSchema)[1].nodes.Foo
  ).contents;

  // TODO: remove unneeded imports
  // Validation should require that a primary key field exists
  expect(contents).toEqual(`// SIGNED-SOURCE: <d4539509b5128a4c8a9f2eef3dbd3ef8>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Foo, { Data, spec } from "./Foo.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create() {
    return new FooQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Foo>) {
    return this.create().whereId(P.equals(id));
  }
}
`);
});

test("OutboundEdgeViaFieldSchema", () => {
  const contents = genIt(
    compileFromString(OutboundEdgeViaFieldSchema)[1].nodes.Foo
  ).contents;

  // TODO: queryBar is wrong as it needs a `where` statement applied
  // to understand _how_ we're hopping.
  // queryBar().whereId(P.equals(this.barId));
  expect(contents).toEqual(`// SIGNED-SOURCE: <b4891c29f54c49e88415cc6e1ffbf41f>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Foo, { Data, spec } from "./Foo.js";
import Bar from "./Bar.js";
import { spec as BarSpec } from "./Bar";
import BarQuery from "./BarQuery";

export default class FooQuery extends DerivedQuery<Foo> {
  static create() {
    return new FooQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Foo>) {
    return this.create().whereId(P.equals(id));
  }

  whereBarId(p: Predicate<Data["barId"]>) {
    return new FooQuery(
      this,
      filter(new ModelFieldGetter<"barId", Data, Foo>("barId"), p)
    );
  }
  queryBar(): BarQuery {
    return new BarQuery(
      QueryFactory.createHopQueryFor(this, spec, BarSpec),
      modelLoad(BarSpec.createFrom)
    ).whereId(P.equals(this.barId));
  }
}
`);
});

test("OutboundThroughForeignFieldSchema", () => {
  const contents = genIt(
    compileFromString(OutboundThroughForeignFieldSchema)[1].nodes.Foo
  ).contents;

  expect(contents).toEqual(`// SIGNED-SOURCE: <36a1dcef7580bd1dd135c23ca050b6ef>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Foo, { Data, spec } from "./Foo.js";

import { spec as BarSpec } from "./Bar";
import BarQuery from "./BarQuery";

export default class FooQuery extends DerivedQuery<Foo> {
  static create() {
    return new FooQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Foo>) {
    return this.create().whereId(P.equals(id));
  }

  queryBars(): BarQuery {
    return new BarQuery(
      QueryFactory.createHopQueryFor(this, spec, BarSpec),
      modelLoad(BarSpec.createFrom)
    ).whereFooId(P.equals(this.id));
  }
}
`);
});

function genIt(schema: Node) {
  return new GenTypescriptQuery(schema).gen();
}
