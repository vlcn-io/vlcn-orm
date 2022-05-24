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

  // remove manual sections as they don't contribute to the signature

  if (sig !== md5(baseContent)) {
    throw {
      code: 'bad-signature',
    };
  }
}

export function removeManualSections(
  content: string,
  startMarkerTemplate: string,
  endMarker: string,
): string {
  const lines = content.split('\n');
  const startMarkRegex = makeStartMarkerRegex(startMarkerTemplate);

  const generatedLines: string[] = [];
  let inManualSection = false;
  for (const line of lines) {
    if (line.indexOf(endMarker) != -1) {
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
  startMarkerTemplate: string,
): string {
  const lines = content.split('\n');
  const startMarkRegex = makeStartMarkerRegex(startMarkerTemplate);

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
      throw new Error(`Unable to find code for manual section ${manualSectionStarts[i][1]}`);
    }
    lines.splice(manualSectionStarts[i][0] + 1, 0, ...toInsert);
  }

  return lines.join('\n');
}

export function readManualSections(
  content: string,
  startMarkerTemplate: string,
  endMarker: string,
): Map<string, string[]> {
  const ret: Map<string, string[]> = new Map();
  const lines = content.split('\n');
  const startMarkRegex = makeStartMarkerRegex(startMarkerTemplate);

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
      if (line.indexOf(endMarker) != -1) {
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
