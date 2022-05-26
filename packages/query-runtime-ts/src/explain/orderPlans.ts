import HopPlan from '../HopPlan.js';
import { IPlan } from '../Plan.js';

export default function orderPlans(plan: IPlan): IPlan[] {
  const plans: IPlan[] = [];
  let sourcePlan: IPlan | null = plan;
  while (sourcePlan != null) {
    plans.push(sourcePlan);
    if (sourcePlan instanceof HopPlan) {
      sourcePlan = sourcePlan.sourcePlan;
    } else {
      sourcePlan = null;
    }
  }

  plans.reverse();
  return plans;
}
