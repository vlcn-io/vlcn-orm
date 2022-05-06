import { sign, readSignature, removeSignature, checkSignature } from '../CodegenFile.js';
import md5 from 'md5';
import fc from 'fast-check';

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
