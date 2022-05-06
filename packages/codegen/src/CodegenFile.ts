import { invariant } from '@strut/utils';
import md5 from 'md5';

export function sign(content: string, template: string) {
  return `${template.replace('<>', '<' + md5(content) + '>\n')}${content}`;
}

export function readSignature(content: string, template: string): string {
  const templateReg = new RegExp(template.replace('<>', '<([0-9a-f]+)>'));
  const firstLine = content.split('\n')[0];
  const result = templateReg.exec(firstLine);
  if (result) {
    return result[1];
  }

  throw new Error('Could not find signature for ' + template + ' ' + firstLine);
}

export function removeSignature(content: string, template: string): string {
  const templateReg = new RegExp(template.replace('<>', '<([0-9a-f]+)>\n'));
  return content.replace(templateReg, '');
}

export function checkSignature(content: string, template: string): void {
  const sig = readSignature(content, template);
  const baseContent = removeSignature(content, template);
  invariant(sig === md5(baseContent), 'Signature from file did not match contents of file');
}
