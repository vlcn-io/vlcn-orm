export default class ClassConfig {
  decorators: Readonly<string[]> = [];

  decorator(...v: string[]): this {
    this.decorators = this.decorators.concat(v);
    return this;
  }
}
