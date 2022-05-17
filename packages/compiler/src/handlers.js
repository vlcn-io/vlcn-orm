import fs from 'fs';

import layout from './layouts/layouts.js';
import { read } from 'to-vfile';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkWikiLink from 'remark-wiki-link';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import toc from '@jsdevtools/rehype-toc';
import rehypeDocument from './rehype-document.js';
import rehypeMeta from 'rehype-meta';
import rehypeInferTitleMeta from 'rehype-infer-title-meta';
import rehypeInferDescriptionMeta from 'rehype-infer-description-meta';
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta';
import rehypeParse from 'rehype-parse';
// import unifiedInferGitMeta from 'unified-infer-git-meta';
import { compile as compileMdx } from '@mdx-js/mdx';
import { matter } from 'vfile-matter';

import clojure from 'highlight.js/lib/languages/clojure';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import rust from 'highlight.js/lib/languages/rust';
import path, { parse } from 'path';
import { doc, meta } from './layouts/global.js';

export default {
  async mdx(file, cwd) {
    // TODO: extract frontmatter and things. Enable GFM and such.
    const compiledMdx = await compileMdx(await read(file), {
      jsxImportSource: 'https://esm.sh/react',
      remarkPlugins: [
        remarkFrontmatter,
        () => (tree, file) => {
          matter(file, { strip: true });
        },
        remarkGfm,
        remarkWikiLink,
      ],
      rehypePlugins: [
        [rehypeInferDescriptionMeta, { truncateSize: 255 }],
        rehypeSlug,
        toc,
        rehypeAutolinkHeadings,
        [
          rehypeHighlight,
          {
            languages: { clojure, typescript, javascript, java, xml, rust },
          },
        ],
      ],
    });
    const companionScriptName = path.basename(file) + '.js';
    const parsed = await processMarkdown(
      '<div id="mdx"></div>',
      {
        script: `import MDXContent from "./${companionScriptName}";
import React from 'https://esm.sh/react';
import { createRoot } from 'https://esm.sh/react-dom/client';

const rootElement = document.getElementById("mdx");
const root = createRoot(rootElement)
root.render(React.createElement(MDXContent, {}, null));
`,
        js: compiledMdx.data.matter.js || [],
      },
      compiledMdx.data.matter,
    );

    return {
      content: parsed.toString(),
      frontmatter: compiledMdx.data.matter,
      meta: compiledMdx.data.meta || {},
      compiledFilename: compiledFilename(file),
      greymatter: {},
      companionFiles: [
        {
          name: companionScriptName,
          content: compiledMdx.toString(),
        },
      ],
    };
  },

  async md(file, cwd) {
    const parsed = await processMarkdown(await read(file));

    return {
      content: parsed.toString(),
      frontmatter: parsed.data.matter,
      meta: parsed.data.meta || {},
      compiledFilename: compiledFilename(file),
      greymatter: {},
    };
  },

  async json(file, cwd) {
    const contents = await fs.promises.readFile(file, { encoding: 'utf8' });
    return JSON.parse(contents);
  },

  async html(file, cwd) {
    const parsed = await addRehypePlugins(unified().use(rehypeParse)).process(
      await read(file),
    );
    return {
      content: parsed.toString(),
      frontmatter: parsed.data?.matter || {},
      meta: parsed.data?.meta || {},
      compiledFilename: compiledFilename(file),
      greymatter: {},
    };
  },

  async js(file, cwd, files) {
    // should js return a rehype doc?
    // probs.. so we can have all the same integrations as above.
    const module = await import(file);
    const ret = module.default(file, cwd, files);
    ret.compiledFilename = compiledFilename(file);
    return ret;
  },
};

async function processMarkdown(fileOrContent, docAdditions, gottenMatter) {
  return await addRehypePlugins(
    unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(() => (tree, file) => {
        if (gottenMatter) {
          file.data.matter = gottenMatter;
          return;
        }
        matter(file, { strip: true });
      })
      .use(remarkGfm)
      .use(remarkWikiLink)
      .use(remarkRehype, { allowDangerousHtml: true }),
    docAdditions,
    gottenMatter,
  ).process(fileOrContent);
}

function addRehypePlugins(pipeline, docAdditions, gottenMatter) {
  return pipeline
    .use(rehypeInferDescriptionMeta, { truncateSize: 255 })
    .use(rehypeInferTitleMeta)
    .use(rehypeSlug)
    .use(toc)
    .use(rehypeInferReadingTimeMeta)
    .use(rehypeAutolinkHeadings)
    .use(rehypeHighlight, {
      languages: { clojure, typescript, javascript, java, xml, rust },
    })
    .use(rehypeDocument, {
      ...doc,
      ...docAdditions,
      js: (doc.js || []).concat((docAdditions || {}).js || []),
    })
    .use(rehypeMeta, meta)
    .use(layout)
    .use(rehypeStringify, { allowDangerousHtml: true });
}

function compiledFilename(file) {
  let ret = path.basename(file);
  return ret.substring(0, ret.lastIndexOf('.')) + '.html';
}

// https://unifiedjs.com/explore/package/rehype-meta/
