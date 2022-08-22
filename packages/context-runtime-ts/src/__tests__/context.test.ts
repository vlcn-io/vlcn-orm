import { asId } from '@strut/sid';
import { debugContext } from '../context.js';
import { viewer } from '../viewer.js';
import { jest } from '@jest/globals';

test('debug context intercepts and prints all calls to the db', () => {
  const ctx = debugContext(viewer(asId('sdf')));

  const db = ctx.dbResolver.engine('memory').db('test');
  expect(db).not.toBeUndefined();

  console.log = jest.fn();
  db.read({
    type: 'read',
    tablish: 'foo',
    roots: [],
  });
  expect(console.log).toBeCalledTimes(2);
  // expect(console.log).nthCalledWith(1, ['query']);
  // expect(console.log).nthCalledWith(2, [
  //   [
  //     {
  //       type: 'read',
  //       tablish: 'foo',
  //       roots: [],
  //     },
  //   ],
  // ]);
});
