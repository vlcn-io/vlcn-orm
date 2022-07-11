import { fieldToTsType } from '../tsUtils';

test('field to ts type', () => {
  expect(
    fieldToTsType({
      type: ['null'],
    }),
  ).toEqual('null');

  expect(
    fieldToTsType({
      type: [
        {
          type: 'primitive',
          subtype: 'null',
        },
      ],
    }),
  ).toEqual('null');

  expect(
    fieldToTsType({
      type: ['Foo'],
    }),
  ).toEqual('Foo');
});
