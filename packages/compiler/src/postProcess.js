// takes a compiled page and adds all the relevant things to
// make it standalone.
// Basically LAMP of old but ahead of time.
import path from 'path';

export default function postProcess(filepath, artifact, index) {
  const ext = path.extname(filepath).substring(1);
  const filename = path.basename(filepath);
  const compiledFilepath =
    filepath.substring(0, filepath.lastIndexOf(filename)) +
    artifact.compiledFilename;

  if (ext === 'js') {
    return [
      compiledFilepath,
      typeof artifact.content === 'function'
        ? artifact.content(index)
        : artifact.content,
    ];
  }

  return [compiledFilepath, artifact.content];
}
