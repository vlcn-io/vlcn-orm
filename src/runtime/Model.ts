export default class Model<T> {
  protected readonly data: Readonly<T>;

  protected constructor(data: T) {
    this.data = data;
  }
}
