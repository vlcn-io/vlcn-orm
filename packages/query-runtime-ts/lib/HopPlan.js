export default class HopPlan {
    hop;
    #sourcePlan;
    #derivations;
    constructor(sourcePlan, hop, derivations) {
        this.hop = hop;
        this.#derivations = derivations;
        this.#sourcePlan = sourcePlan;
    }
    get derivations() {
        return this.#derivations;
    }
    get iterable() {
        const iterable = this.hop.chainAfter(this.#sourcePlan.iterable);
        return this.#derivations.reduce((iterable, expression) => expression.chainAfter(iterable), iterable);
    }
    addDerivation(expression) {
        if (!expression) {
            return this;
        }
        this.#derivations.push(expression);
        return this;
    }
    /**
     * Queries are built up into a reverse linked list.
     * The last query is what the user executes.
     * This last query will optimize from the end back on down.
     */
    optimize(nextHop) {
        // Optimize our hop and fold in the next hop
        const optimizedPlanForThisHop = this.hop.optimize(this, nextHop);
        return this.#sourcePlan.optimize(optimizedPlanForThisHop);
    }
}
//# sourceMappingURL=HopPlan.js.map