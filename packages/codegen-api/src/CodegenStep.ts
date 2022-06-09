import { CodegenFile } from './CodegenFile.js';
import { Node, Edge } from '@aphro/schema-api';

export default abstract class CodegenStep {
  constructor() {}

  abstract gen(): CodegenFile;
}
