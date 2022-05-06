import { sign, extractSignature } from '../CodegenFile.js';
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

test('Check signature', () => {
  fc.assert(
    fc.property(fc.string(), content => {
      const hash = md5(content);
      const signed = sign(content, '<>');
      expect(extractSignature(signed, '<>')).toBe(hash);
    }),
  );
});
