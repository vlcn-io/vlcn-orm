import { Templates } from '@aphro/codegen-api';
// @ts-ignore
import md5 from 'md5';

export function sign(content: string, templates: Templates) {
  // We have a call to "removeManualSections" here because the code-generator may wish to place comments into manual
  // sections. Those comments shouldn't get hashed.
  return `${templates.signature.replace(
    '<>',
    '<' + md5(removeManualSections(content, templates)) + '>\n',
  )}${content}`;
}

export function readSignature(content: string, templates: Templates): string {
  const templateReg = new RegExp(templates.signature.replace('<>', '<([0-9a-f]+)>'));
  const firstLine = content.split('\n')[0];
  const result = templateReg.exec(firstLine);
  if (result) {
    return result[1];
  }

  throw new Error('Could not find signature for ' + templates.signature + '\n' + firstLine);
}

export function removeSignature(content: string, templates: Templates): string {
  const templateReg = new RegExp(templates.signature.replace('<>', '<([0-9a-f]+)>\n'));
  return content.replace(templateReg, '');
}

export function checkSignature(content: string, templates: Templates): void {
  const sig = readSignature(content, templates);
  const baseContent = removeManualSections(removeSignature(content, templates), templates);

  if (sig !== md5(baseContent)) {
    throw {
      code: 'bad-signature',
    };
  }
}

export function removeManualSections(content: string, templates: Templates): string {
  const lines = content.split('\n');
  const startMarkRegex = makeStartMarkerRegex(templates.startManual);

  const generatedLines: string[] = [];
  let inManualSection = false;
  for (const line of lines) {
    if (line.indexOf(templates.endManual) != -1) {
      inManualSection = false;
    }
    if (startMarkRegex.exec(line) != null) {
      generatedLines.push(line);
      inManualSection = true;
    }
    if (inManualSection) {
      continue;
    }
    generatedLines.push(line);
  }

  return generatedLines.join('\n');
}

export function insertManualSections(
  content: string,
  manualCode: Map<string, string[]>,
  templates: Templates,
): string {
  const lines = content.split('\n');
  const startMarkRegex = makeStartMarkerRegex(templates.startManual);

  const manualSectionStarts: [number, string][] = [];
  lines.forEach((line, i) => {
    const match = startMarkRegex.exec(line);
    if (!match) {
      return;
    }

    manualSectionStarts.push([i, match[1]]);
  });

  for (let i = manualSectionStarts.length - 1; i >= 0; --i) {
    const toInsert = manualCode.get(manualSectionStarts[i][1]);
    if (toInsert == null) {
      // This is a valid case. The schema could create a new manual section that does not yet exist in the generated file.
      // e.g., when defining a new mutation on an existing schema.
      continue;
    }
    lines.splice(manualSectionStarts[i][0] + 1, 0, ...toInsert);
  }

  return lines.join('\n');
}

export function readManualSections(content: string, templates: Templates): Map<string, string[]> {
  const ret: Map<string, string[]> = new Map();
  const lines = content.split('\n');
  const startMarkRegex = makeStartMarkerRegex(templates.startManual);

  let manualSectionName: string | null = null;
  let manualLines: string[] = [];

  const endManualSection = () => {
    manualSectionName = null;
    manualLines = [];
  };
  const startManualSection = (match: RegExpExecArray) => {
    manualSectionName = match[1];
    if (manualSectionName == null) {
      throw new Error(
        `While processing ${content.substring(0, 100)} we hit a manual section without a name`,
      );
    }
  };

  for (const line of lines) {
    if (manualSectionName != null) {
      if (line.indexOf(templates.endManual) != -1) {
        ret.set(manualSectionName, manualLines);
        endManualSection();
        continue;
      }
      manualLines.push(line);
      continue;
    }

    const match = startMarkRegex.exec(line);
    if (!match) {
      continue;
    }

    startManualSection(match);
  }

  return ret;
}

function makeStartMarkerRegex(template: string) {
  return new RegExp(template.replace('[]', '\\[(.*)\\]'));
}
