import { Node } from '@aphro/schema';

export default interface AphroditeIntegration {
  applyTo(schema: Node): void;
}
