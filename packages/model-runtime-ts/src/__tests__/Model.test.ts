jest.useFakeTimers();
import Model from '../Model.js';

class TestModel extends Model<{ thing: number; foo: number }> {}

test('Data is sealed', () => {
  const m = new TestModel({ thing: 1, foo: 2 });
  const data = m._d();
  expect(() => (data.foo = 2)).toThrow();
});
