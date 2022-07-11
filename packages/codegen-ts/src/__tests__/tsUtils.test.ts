import { fieldToTsType } from '../tsUtils';

test('field to ts type', () => {
  expect(
    fieldToTsType({
      type: ['null'],
    }),
  ).toEqual('null');
});
