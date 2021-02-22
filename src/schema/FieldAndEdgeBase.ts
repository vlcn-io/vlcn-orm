import nullthrows from "../utils/nullthrows";

export default class FieldAndEdgeBase {
  decorators: Readonly<string[]> = [];
  isUnique: boolean;
  name: string;
  description: string;

  decorator(...v: string[]): this {
    this.decorators = this.decorators.concat(v);
    return this;
  }

  unique(value: boolean = true): this {
    this.isUnique = true;
    return this;
  }
}
