import { Node } from '@aphro/schema-api';
import { createCompiler } from '@aphro/schema';
import GenTypescriptQuery from '../GenTypescriptQuery';

const { compileFromString } = createCompiler();

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

test('NoEdgesSchema', async () => {
  const contents = (await genIt(compileFromString(NoEdgesSchema)[1].nodes.Foo)).contents;

  // TODO: remove unneeded imports
  // Validation should require that a primary key field exists
  expect(contents).toEqual(`// SIGNED-SOURCE: <2df261839ac9ac4c6ffd5245ecf0fd7a>
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import Foo from "./Foo.js";
import { Data } from "./Foo.js";
import { default as spec } from "./FooSpec.js";

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

test('OutboundEdgeViaFieldSchema', async () => {
  const contents = (await genIt(compileFromString(OutboundEdgeViaFieldSchema)[1].nodes.Foo))
    .contents;

  // TODO: queryBar is wrong as it needs a `where` statement applied
  // to understand _how_ we're hopping.
  // queryBar().whereId(P.equals(this.barId));
  expect(contents).toEqual(`// SIGNED-SOURCE: <352854ea6276f8f2e87be050c5ea70d4>
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import Foo from "./Foo.js";
import { Data } from "./Foo.js";
import { default as spec } from "./FooSpec.js";
import Bar from "./Bar.js";
import { default as BarSpec } from "./BarSpec.js";
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
      QueryFactory.createHopQueryFor(this, spec.outboundEdges.bar),
      modelLoad(BarSpec.createFrom)
    );
  }
}
`);
});

test('OutboundThroughForeignFieldSchema', async () => {
  const contents = (await genIt(compileFromString(OutboundThroughForeignFieldSchema)[1].nodes.Foo))
    .contents;

  expect(contents).toEqual(`// SIGNED-SOURCE: <56d05175d9549f70182c344f3305038d>
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import Foo from "./Foo.js";
import { Data } from "./Foo.js";
import { default as spec } from "./FooSpec.js";
import { default as BarSpec } from "./BarSpec.js";
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
      QueryFactory.createHopQueryFor(this, spec.outboundEdges.bars),
      modelLoad(BarSpec.createFrom)
    );
  }
}
`);
});

function genIt(schema: Node) {
  return new GenTypescriptQuery(schema, '').gen();
}
