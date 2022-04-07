import { Field } from '@aphro/schema-api';

export default {
  decorate(f: Field, decoration: string) {
    const decorators = (f.decorators = f.decorators || []);
    decorators.push(decoration);
  },
};
