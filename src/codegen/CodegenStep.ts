export default abstract class CodegenStep {
  constructor() {}

  abstract gen(): string;
}
