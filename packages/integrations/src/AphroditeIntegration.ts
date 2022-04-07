import { Node } from '@aphro/schema-api';

export default interface AphroditeIntegration {
  applyTo(schema: Node): void;
}
