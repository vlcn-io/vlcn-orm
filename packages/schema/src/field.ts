import { Field } from './SchemaType.js';

export default {
  decorate(f: Field, decoration: string) {
    const decorators = (f.decorators = f.decorators || []);
    decorators.push(decoration);
  },
};
