import { SchemaNode } from '@aphro/schema-api';
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
  expect(contents).toEqual(`// SIGNED-SOURCE: <86219b43127d361c4e0130aff0df9ad0>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { take } from "@aphro/runtime-ts";
import { orderBy } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { Expression } from "@aphro/runtime-ts";
import { EmptyQuery } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Foo from "../Foo.js";
import { Data } from "./FooBase.js";
import FooSpec from "./FooSpec.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create(ctx: Context) {
    return new FooQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, FooSpec),
      modelLoad(ctx, FooSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new FooQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): FooQuery {
    return new FooQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Foo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  take(n: number) {
    return new FooQuery(this.ctx, this, take(n));
  }
}
`);
});

test('OutboundEdgeViaFieldSchema', async () => {
  const contents = (await genIt(compileFromString(OutboundEdgeViaFieldSchema)[1].nodes.Foo))
    .contents;

  expect(contents).toEqual(`// SIGNED-SOURCE: <afc38a702ee61fa481fd19383e09e039>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { take } from "@aphro/runtime-ts";
import { orderBy } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { Expression } from "@aphro/runtime-ts";
import { EmptyQuery } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Foo from "../Foo.js";
import { Data } from "./FooBase.js";
import FooSpec from "./FooSpec.js";
import Bar from "../Bar.js";
import BarSpec from "./BarSpec.js";
import BarQuery from "./BarQuery.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create(ctx: Context) {
    return new FooQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, FooSpec),
      modelLoad(ctx, FooSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new FooQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): FooQuery {
    return new FooQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Foo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereBarId(p: Predicate<Data["barId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"barId", Data, Foo>("barId"), p)
    );
  }
  queryBar(): BarQuery {
    return new BarQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, FooSpec.outboundEdges.bar),
      modelLoad(this.ctx, BarSpec.createFrom)
    );
  }

  take(n: number) {
    return new FooQuery(this.ctx, this, take(n));
  }

  orderByBarId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"barId", Data, Foo>("barId"), direction)
    );
  }
}
`);
});

test('OutboundThroughForeignFieldSchema', async () => {
  const contents = (await genIt(compileFromString(OutboundThroughForeignFieldSchema)[1].nodes.Foo))
    .contents;

  expect(contents).toEqual(`// SIGNED-SOURCE: <1222775915aac9b251cdfbb9ce058982>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { take } from "@aphro/runtime-ts";
import { orderBy } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { Expression } from "@aphro/runtime-ts";
import { EmptyQuery } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Foo from "../Foo.js";
import { Data } from "./FooBase.js";
import FooSpec from "./FooSpec.js";
import BarSpec from "./BarSpec.js";
import BarQuery from "./BarQuery.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create(ctx: Context) {
    return new FooQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, FooSpec),
      modelLoad(ctx, FooSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new FooQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): FooQuery {
    return new FooQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Foo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  queryBars(): BarQuery {
    return new BarQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        FooSpec.outboundEdges.bars
      ),
      modelLoad(this.ctx, BarSpec.createFrom)
    );
  }

  take(n: number) {
    return new FooQuery(this.ctx, this, take(n));
  }
}
`);
});

function genIt(schema: SchemaNode) {
  return new GenTypescriptQuery({ nodeOrEdge: schema, edges: {}, dest: '' }).gen();
}
