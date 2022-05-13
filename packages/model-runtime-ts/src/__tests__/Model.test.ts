jest.useFakeTimers();
import { debugContext } from '@aphro/context-runtime-ts';
import { viewer } from '@aphro/context-runtime-ts/lib/viewer';
import { asId } from '@strut/sid';
import Model from '../Model.js';

class TestModel extends Model<{ thing: number; foo: number }> {
  readonly id = asId<this>('foo');
}

const context = debugContext(viewer(asId('1')));
test('Data is frozen and sealed', () => {
  const m = new TestModel(context, { thing: 1, foo: 2 });
  const data = m._d();
  expect(() => (data.foo = 0)).toThrow();
  //@ts-ignore
  expect(() => (data.bar = 1)).toThrow();
});
