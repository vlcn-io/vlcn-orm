export default class FieldAndEdgeBase {
  decorators: Array<string> = [];

  decorator(...v: string[]): this {
    this.decorators = this.decorators.concat(v);
    return this;
  }
}
