export default class FieldAndEdgeBase {
  decorators: Array<string> = [];
  isUnique: boolean;

  decorator(...v: string[]): this {
    this.decorators = this.decorators.concat(v);
    return this;
  }

  unique(value: boolean = true): this{
    this.isUnique = true;
    return this;
  }
}
