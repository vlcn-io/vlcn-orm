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
  expect(contents).toEqual(`// SIGNED-SOURCE: <4e728ed8200ff078b3a0647288b7650b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
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
import Foo from "./Foo.js";
import { Data } from "./Foo.js";
import { default as spec } from "./FooSpec.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create(ctx: Context) {
    return new FooQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Foo>) {
    return this.create(ctx).whereId(P.equals(id));
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
  expect(contents).toEqual(`// SIGNED-SOURCE: <397635a282c249258a02c22c2b4d096c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
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
import Foo from "./Foo.js";
import { Data } from "./Foo.js";
import { default as spec } from "./FooSpec.js";
import Bar from "./Bar.js";
import { default as BarSpec } from "./BarSpec.js";
import BarQuery from "./BarQuery.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create(ctx: Context) {
    return new FooQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Foo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereBarId(p: Predicate<Data["barId"]>) {
    return new FooQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"barId", Data, Foo>("barId"), p)
    );
  }
  queryBar(): BarQuery {
    return new BarQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.bar),
      modelLoad(this.ctx, BarSpec.createFrom)
    );
  }
}
`);
});

test('OutboundThroughForeignFieldSchema', async () => {
  const contents = (await genIt(compileFromString(OutboundThroughForeignFieldSchema)[1].nodes.Foo))
    .contents;

  expect(contents).toEqual(`// SIGNED-SOURCE: <9755b571c0f183ddb0df7509e94d4ae8>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated \`BEGIN-MANUAL-SECTION\` and
 * \`END-MANUAL-SECTION\` markers.
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
import Foo from "./Foo.js";
import { Data } from "./Foo.js";
import { default as spec } from "./FooSpec.js";
import { default as BarSpec } from "./BarSpec.js";
import BarQuery from "./BarQuery.js";

export default class FooQuery extends DerivedQuery<Foo> {
  static create(ctx: Context) {
    return new FooQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<Foo>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  queryBars(): BarQuery {
    return new BarQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.bars),
      modelLoad(this.ctx, BarSpec.createFrom)
    );
  }
}
`);
});

function genIt(schema: Node) {
  return new GenTypescriptQuery({ nodeOrEdge: schema, edges: {}, dest: '' }).gen();
}
