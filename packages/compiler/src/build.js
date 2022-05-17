import fs from 'fs';
import path from 'path';
import handlers from './handlers.js';
import postProcess from './postProcess.js';

const builtDir = './docs/';

export default async function build(collection) {
  const dest = builtDir + collection;
  const files = await fs.promises.readdir('./content/' + collection);
  const artifacts = (
    await Promise.all(
      files.map(async (file) => {
        const ext = path.extname(file).substring(1);
        const handler = handlers[ext];
        if (!handler) {
          return null;
        }
        let artifact;
        try {
          artifact = await handler(
            path.resolve('./content/' + collection + file),
            path.resolve('./content/' + collection),
            files,
          );
        } catch (e) {
          console.error('Failed compiling ' + file);
          console.error(e);
          return null;
        }

        return [dest + '/' + file, artifact];
      }),
    )
  ).filter((a) => a != null);

  const theIndex = index(artifacts);

  await fs.promises.mkdir(dest, { recursive: true });
  await Promise.all(
    artifacts.flatMap(([destPath, a]) => {
      const [stadalonePath, content] = postProcess(destPath, a, theIndex);
      return [
        fs.promises.writeFile(stadalonePath, content),
        ...[
          (a.companionFiles || []).map((f) => {
            fs.promises.writeFile(
              path.dirname(stadalonePath) + '/' + f.name,
              f.content,
            );
          }),
        ],
      ];
    }),
  );
}

/**
 * @param {[string, {frontmatter: {[key: string]: any}}][]} artifacts
 */
function index(artifacts) {
  const ret = artifacts.reduce((l, r) => {
    l[path.basename(r[0])] = {
      compiledFilename: r[1].compiledFilename,
      frontmatter: r[1].frontmatter || {},
      greymatter: r[1].greymatter,
      meta: r[1].meta || {},
    };
    return l;
  }, {});
  return ret;
}
