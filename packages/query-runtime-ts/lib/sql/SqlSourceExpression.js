import SQLSourceChunkIterable from './SqlSourceChunkIterable.js';
import Plan from '../Plan.js';
import { ModelFieldGetter } from '../Field.js';
export default class SQLSourceExpression {
    spec;
    hoistedOperations;
    constructor(
    // we should take a schema instead of db
    // we'd need the schema to know if we can hoist certain fields or not
    spec, hoistedOperations) {
        this.spec = spec;
        this.hoistedOperations = hoistedOperations;
    }
    get iterable() {
        return new SQLSourceChunkIterable(this.spec, this.hoistedOperations);
    }
    optimize(plan, nextHop) {
        const remainingExpressions = [];
        let { filters, orderBy, limit, hop, what, before, after } = this.hoistedOperations;
        const writableFilters = filters ? [...filters] : [];
        for (let i = 0; i < plan.derivations.length; ++i) {
            const derivation = plan.derivations[i];
            switch (derivation.type) {
                case 'filter':
                    if (!this.#optimizeFilter(derivation)) {
                        remainingExpressions.push(derivation);
                    }
                    else {
                        writableFilters.push(derivation);
                    }
                    break;
                case 'take':
                    if (!this.#optimizeTake(derivation)) {
                        remainingExpressions.push(derivation);
                    }
                    else {
                        limit = derivation;
                    }
                    break;
                case 'before':
                    if (!this.#optimizeBefore(derivation)) {
                        remainingExpressions.push(derivation);
                    }
                    else {
                        before = derivation;
                    }
                    break;
                case 'after':
                    if (!this.#optimizeAfter(derivation)) {
                        remainingExpressions.push(derivation);
                    }
                    else {
                        after = derivation;
                    }
                    break;
                case 'orderBy':
                    if (!this.#optimizeOrderBy(derivation)) {
                        remainingExpressions.push(derivation);
                    }
                    break;
                case 'hop':
                    // This can't happen... hop will be in `nextHop`
                    throw new Error('Hops should be passed in as hop plans');
                default:
                    remainingExpressions.push(derivation);
            }
        }
        if (nextHop) {
            const [hoistedHop, derivedExressions] = this.#optimizeHop(nextHop, remainingExpressions.length > 0);
            for (const e of derivedExressions) {
                remainingExpressions.push(e);
            }
            hop = hoistedHop;
        }
        return new Plan(new SQLSourceExpression(this.spec, {
            filters,
            orderBy,
            limit,
            hop,
            what,
            before,
            after,
        }), remainingExpressions);
    }
    #optimizeFilter(expression) {
        if (expression.getter instanceof ModelFieldGetter) {
            return true;
        }
        return false;
    }
    #optimizeTake(expression) {
        return false;
    }
    #optimizeBefore(expression) {
        return false;
    }
    #optimizeAfter(expression) {
        return false;
    }
    #optimizeOrderBy(expression) {
        return false;
    }
    #optimizeHop(hop, thisHasRemainingExpressions) {
        if (this.#canHoistHop(hop, thisHasRemainingExpressions)) {
            return [hop.hop, hop.derivations];
        }
        // can't hoist it. Just return everything as derived expressions.
        return [undefined, [hop.hop, ...hop.derivations]];
    }
    #canHoistHop(hop, thisHasRemainingExpressions) {
        // If there are expressions that couldn't be rolled into source
        // then we can't roll the hop in too! We'd be hopping before
        // applying all expressions.
        // Nit: -- this isn't quite true...
        // we currently stick in a model load expression immediately when
        // creating a query.
        // We can drop the model load expression when we are hopping
        // because we obvisouly no longer want the model from
        // the first query.
        // Note: we could also just never stick in a model load expression
        // until calling `gen` or what have you.
        // ModelLoadExpression vs IDLoad vs EdgeLoad would determine our `what`
        // parameter which has thus far been indeterminate.
        if (thisHasRemainingExpressions) {
            return false;
        }
        // Check if the hop is:
        // 1. the same backend (e.g., SQL)
        // 2. on the same logical database
        // 3. has a corresponding backend operator (e.g., join) to perform the hop
        return false;
    }
}
//# sourceMappingURL=SqlSourceExpression.js.map