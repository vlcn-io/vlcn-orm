// inverse of predicate
// in set of prediate
// binary predicate?
// case sensitivity?
export class Equal {
    value;
    constructor(value) {
        this.value = value;
    }
    call(what) {
        return what === this.value;
    }
    invert() {
        return new NotEqual(this.value);
    }
}
export class NotEqual {
    value;
    constructor(value) {
        this.value = value;
    }
    call(what) {
        return what !== this.value;
    }
    invert() {
        return new Equal(this.value);
    }
}
const P = {
    equals(value) {
        return new Equal(value);
    },
    notEqual(value) {
        return new NotEqual(value);
    },
};
export default P;
//# sourceMappingURL=Predicate.js.map