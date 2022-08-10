import {
  sign,
  readSignature,
  removeSignature,
  checkSignature,
  readManualSections,
  removeManualSections,
  insertManualSections,
} from '../CodegenFile.js';
// @ts-ignore
import md5 from 'md5';
import fc from 'fast-check';
import { algolTemplates } from '@aphro/codegen-api';

const templates = {
  signature: '<>',
  startManual: algolTemplates.startManual,
  endManual: algolTemplates.endManual,
};

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
      const signed = sign(content, templates);
      const hash = md5(content);
      expect(signed).toEqual(`<${hash}>\n${content}`);
    }),
  );
});

test('Check read signature', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const hash = md5(content);
      const signed = sign(content, templates);
      expect(readSignature(signed, templates)).toBe(hash);
    }),
  );
});

test('Removing signature', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const hash = md5(content);
      const signed = sign(content, templates);
      expect(removeSignature(signed, templates)).toBe(content);
    }),
  );
});

test('Checking embedded signature', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const signed = sign(content, templates);
      expect(() => checkSignature(signed, templates)).not.toThrow();
    }),
  );

  fc.assert(
    fc.property(fc.string(), fc.string({ minLength: 1, maxLength: 5 }), (content, perturb) => {
      const signed = sign(content, templates) + perturb;
      expect(() => checkSignature(signed, templates)).toThrow();
    }),
  );
});

test('Reading manual sections', () => {
  const extracted = readManualSections(codeWithManualSections, algolTemplates);

  expect(extracted.get('first')).toEqual([]);
  expect(extracted.get('second')).toEqual(['manual-two']);
  expect(extracted.get('third')).toEqual(['manual', 'three']);
});

test('Removing manual sections', () => {
  expect(removeManualSections(codeWithManualSections, algolTemplates)).toEqual(
    codeWithManualSectionsNoAddtions,
  );
});

test('Adding manual additions back in', () => {
  const read = readManualSections(codeWithManualSections, algolTemplates);

  const inserted = insertManualSections(codeWithManualSectionsNoAddtions, read, algolTemplates);
  expect(inserted).toEqual(codeWithManualSections);
});

test('Signing code with manual sections and checking that signature', () => {
  const read = readManualSections(codeWithManualSections, algolTemplates);

  const noAddtionsSigned = sign(codeWithManualSectionsNoAddtions, algolTemplates);
  const signedThenManuallyModified = insertManualSections(noAddtionsSigned, read, algolTemplates);

  expect(() => checkSignature(signedThenManuallyModified, algolTemplates)).not.toThrow();
});
