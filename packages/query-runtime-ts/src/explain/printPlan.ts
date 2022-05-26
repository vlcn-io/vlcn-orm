import { IPlan } from '../Plan.js';
import orderPlans from './orderPlans.js';

export default function printPlan(plan: IPlan) {
  // Query plans can be chained after other query plans.
  // To get the in-order list of plans, we need to go backwards through the linked list of plans,
  // push each onto an array and then reverse the array.
  const plans = orderPlans(plan);

  // TODO: make this more sophisticated and visit expressions and so on.
  for (const p of plans) {
    console.log(p);
  }
}
