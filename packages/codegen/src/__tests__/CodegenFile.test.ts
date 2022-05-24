import {
  sign,
  readSignature,
  removeSignature,
  checkSignature,
  readManualSections,
  removeManualSections,
  insertManualSections,
} from '../CodegenFile.js';
import md5 from 'md5';
import fc from 'fast-check';
import {
  ALGOL_BEGIN_MANUAL_SECTION_MARKER,
  ALGOL_END_MANUAL_SECTION_MARKER,
} from '@aphro/codegen-api';

const codeWithManualSections = `
one
two
three
// BEGIN-MANUAL-SECTION: [first]
// END-MANUAL-SECTION

other code

// BEGIN-MANUAL-SECTION: [second]
manual-two
// END-MANUAL-SECTION
// BEGIN-MANUAL-SECTION: [third]
manual
three
// END-MANUAL-SECTION

end code
`;

const codeWithManualSectionsNoAddtions = `
one
two
three
// BEGIN-MANUAL-SECTION: [first]
// END-MANUAL-SECTION

other code

// BEGIN-MANUAL-SECTION: [second]
// END-MANUAL-SECTION
// BEGIN-MANUAL-SECTION: [third]
// END-MANUAL-SECTION

end code
`;

test('Signing source', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const signed = sign(content, '<>');
      const hash = md5(content);
      expect(signed).toEqual(`<${hash}>\n${content}`);
    }),
  );
});

test('Check read signature', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const hash = md5(content);
      const signed = sign(content, '<>');
      expect(readSignature(signed, '<>')).toBe(hash);
    }),
  );
});

test('Removing signature', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const hash = md5(content);
      const signed = sign(content, '<>');
      expect(removeSignature(signed, '<>')).toBe(content);
    }),
  );
});

test('Checking embedded signature', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const signed = sign(content, '<>');
      expect(() => checkSignature(signed, '<>')).not.toThrow();
    }),
  );

  fc.assert(
    fc.property(fc.string(), fc.string({ minLength: 1, maxLength: 5 }), (content, perturb) => {
      const signed = sign(content, '<>') + perturb;
      expect(() => checkSignature(signed, '<>')).toThrow();
    }),
  );
});

test('Reading manual sections', () => {
  const extracted = readManualSections(
    codeWithManualSections,
    ALGOL_BEGIN_MANUAL_SECTION_MARKER,
    ALGOL_END_MANUAL_SECTION_MARKER,
  );

  expect(extracted.get('first')).toEqual([]);
  expect(extracted.get('second')).toEqual(['manual-two']);
  expect(extracted.get('third')).toEqual(['manual', 'three']);
});

test('Removing manual sections', () => {
  expect(
    removeManualSections(
      codeWithManualSections,
      ALGOL_BEGIN_MANUAL_SECTION_MARKER,
      ALGOL_END_MANUAL_SECTION_MARKER,
    ),
  ).toEqual(codeWithManualSectionsNoAddtions);
});

test('Adding manual additions back in', () => {
  const read = readManualSections(
    codeWithManualSections,
    ALGOL_BEGIN_MANUAL_SECTION_MARKER,
    ALGOL_END_MANUAL_SECTION_MARKER,
  );

  const inserted = insertManualSections(
    codeWithManualSectionsNoAddtions,
    read,
    ALGOL_BEGIN_MANUAL_SECTION_MARKER,
  );
  expect(inserted).toEqual(codeWithManualSections);
});
