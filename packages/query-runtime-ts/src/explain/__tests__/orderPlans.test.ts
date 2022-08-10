import { ChunkIterable, emptyChunkIterable } from '../../ChunkIterable.js';
import { Expression, HopExpression } from '../../Expression.js';
import HopPlan from '../../HopPlan.js';
import { IPlan } from '../../Plan.js';
import orderPlans from '../orderPlans.js';

class TestSourcePlan implements IPlan {
  get derivations(): readonly Expression[] {
    return [];
  }

  addDerivation(expression?: Expression): this {
    return this;
  }

  get iterable(): ChunkIterable<any> {
    return emptyChunkIterable;
  }

  async gen(): Promise<any[]> {
    return [];
  }

  optimize(nextHop?: HopPlan): IPlan {
    return this;
  }
}

class TestHopExpression implements HopExpression<any, any> {
  chainAfter(iterable: ChunkIterable<any>): ChunkIterable<any> {
    return emptyChunkIterable;
  }
  optimize(sourcePlan: IPlan, plan: HopPlan, nextHop?: HopPlan): HopPlan {
    return plan;
  }
  type: 'hop' = 'hop';
  implicatedDataset(): string {
    return '---';
  }
}

test('re-orders hop plans', () => {
  const source = new TestSourcePlan();
  const hop1 = new HopPlan(source, new TestHopExpression(), []);
  const hop2 = new HopPlan(hop1, new TestHopExpression(), []);

  expect(orderPlans(hop2)).toEqual([source, hop1, hop2]);
});
