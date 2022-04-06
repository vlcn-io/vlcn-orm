import md5 from 'md5';

export function sign(content: string, template: string) {
  return `${template.replace('<>', '<' + md5(content) + '>\n')}${content}`;
}

export function extractSignature(content: string, template: string): string {
  const templateReg = new RegExp(template.replace('<>', '<([0-9a-f]+)>'));
  const firstLine = content.split('\n')[0];
  const result = templateReg.exec(firstLine);
  if (result) {
    return result[1];
  }

  throw new Error('Could not find signature for ' + template + ' ' + firstLine);
}
