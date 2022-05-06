import uniqueImports from '../uniqueImports.js';
import { Import } from '@aphro/schema-api';
import fc from 'fast-check';

test('matching imports are de-duplicated', () => {
  fc.assert(
    fc.property(
      fc.string(),
      fc.string(),
      fc.string(),
      fc.integer({ min: 1, max: 10 }),
      (name, as, from, num) => {
        const imports: Import[] = [];
        for (let i = 0; i < num; ++i) {
          imports.push({
            name,
            as,
            from,
          });
        }
        const uniqued = uniqueImports(imports);
        expect(uniqued.length).toEqual(1);
      },
    ),
  );
});

test('mismatching imports are not de-duplicated', () => {
  fc.assert(
    fc.property(
      fc.string(),
      fc.string(),
      fc.string(),
      fc.integer({ min: 1, max: 10 }),
      (name, as, from, num) => {
        const imports: Import[] = [];
        for (let i = 0; i < num; ++i) {
          imports.push({
            name: `${name}-${i}`,
            as,
            from,
          });
        }
        const uniqued = uniqueImports(imports);
        expect(uniqued.length).toEqual(imports.length);
      },
    ),
  );
});
