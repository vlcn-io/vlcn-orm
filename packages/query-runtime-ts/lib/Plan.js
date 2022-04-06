export default class Plan {
    #source;
    // pairwise TIn and TOuts should match
    #derivations;
    constructor(source, derivations) {
        this.#source = source;
        this.#derivations = derivations;
    }
    get derivations() {
        return this.#derivations;
    }
    get iterable() {
        const iterable = this.#source.iterable;
        return this.#derivations.reduce((iterable, expression) => expression.chainAfter(iterable), iterable);
    }
    addDerivation(expression) {
        if (!expression) {
            return this;
        }
        this.#derivations.push(expression);
        return this;
    }
    optimize(nextHop) {
        return this.#source.optimize(this, nextHop);
    }
}
//# sourceMappingURL=Plan.js.map