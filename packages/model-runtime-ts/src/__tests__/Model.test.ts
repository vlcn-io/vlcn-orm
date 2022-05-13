jest.useFakeTimers();
import { asId } from '@strut/sid';
import Model from '../Model.js';

class TestModel extends Model<{ thing: number; foo: number }> {
  readonly id = asId<this>('foo');
}

test('Data is frozen and sealed', () => {
  const m = new TestModel({ thing: 1, foo: 2 });
  const data = m._d();
  expect(() => (data.foo = 0)).toThrow();
  //@ts-ignore
  expect(() => (data.bar = 1)).toThrow();
});
