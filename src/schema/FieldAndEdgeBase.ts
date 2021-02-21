import nullthrows from "../utils/nullthrows";

export default class FieldAndEdgeBase {
  decorators: Array<string> = [];
  isUnique: boolean;
  name: string;
  description: string;

  decorator(...v: string[]): this {
    this.decorators = this.decorators.concat(v);
    return this;
  }

  unique(value: boolean = true): this{
    this.isUnique = true;
    return this;
  }
}
