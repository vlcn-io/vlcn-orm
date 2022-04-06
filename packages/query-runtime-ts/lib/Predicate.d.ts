export interface Predicate<Tv> {
    call(Tv: any): boolean;
}
export declare class Equal<Tv> implements Predicate<Tv> {
    private value;
    constructor(value: Tv);
    call(what: Tv): boolean;
    invert(): NotEqual<Tv>;
}
export declare class NotEqual<Tv> implements Predicate<Tv> {
    private value;
    constructor(value: Tv);
    call(what: Tv): boolean;
    invert(): Equal<Tv>;
}
declare const P: {
    equals<Tv>(value: Tv): Equal<Tv>;
    notEqual<Tv_1>(value: Tv_1): NotEqual<Tv_1>;
};
export default P;
