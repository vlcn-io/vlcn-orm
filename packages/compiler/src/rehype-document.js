/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').DocType} DocType
 * @typedef {Root|Root['children'][number]} Node
 * @typedef {import('hast').Properties} Properties
 *
 * @typedef Options
 * @property {string|undefined} [title]
 *   Text to use as title.
 *   Defaults to name of file (if any).
 * @property {string|undefined} [language='en']
 *   Natural language of document.
 *   Should be a [BCP 47](https://tools.ietf.org/html/bcp47) language tag.
 * @property {boolean|undefined} [responsive=true]
 *   Whether to insert a `meta[viewport]`.
 * @property {string|Array<string>|undefined} [style=[]]
 *   CSS to include in `head` in `<style>` elements.
 * @property {string|Array<string>|undefined} [css=[]]
 *   Links to stylesheets to include in `head`.
 * @property {Properties|Array<Properties>|undefined} [meta=[]]
 *   Metadata to include in `head`.
 *
 *   Each object is passed as
 *   [`properties`](https://github.com/syntax-tree/hastscript#hselector-properties-children)
 *   to [`hastscript`](https://github.com/syntax-tree/hastscript) with a
 *   `meta` element.
 * @property {Properties|Array<Properties>|undefined} [link=[]]
 *   Link tags to include in `head`.
 *
 *   Each object is passed as
 *   [`properties`](https://github.com/syntax-tree/hastscript#hselector-properties-children)
 *   to [`hastscript`](https://github.com/syntax-tree/hastscript) with a `link`
 *   element.
 * @property {string|Array<string>|undefined} [script=[]]
 *   Inline scripts to include at end of `body` in `<script>`s.
 * @property {string|Array<string>|undefined} [js=[]]
 *   External scripts to include at end of `body` in `script[src]`s.
 */

import { h } from 'hastscript';

/**
 * Wrap a document around a fragment.
 *
 * @type {import('unified').Plugin<[Options?] | Array<void>, Root>}
 */
export default function rehypeDocument(options = {}) {
  const meta = cast(options.meta);
  const link = cast(options.link);
  const styles = cast(options.style);
  const css = cast(options.css);
  const scripts = cast(options.script);
  const js = cast(options.js);

  if (options.responsive !== false) {
    meta.unshift({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    });
  }

  return (tree, file) => {
    const title = options.title || file.stem;
    /** @type {Array<Node>} */
    const contents = tree.type === 'root' ? tree.children.concat() : [tree];
    /** @type {Array<Node>} */
    const head = [
      { type: 'text', value: '\n' },
      h('meta', { charset: 'utf-8' }),
    ];
    let index = -1;

    if (contents.length > 0) {
      contents.unshift({ type: 'text', value: '\n' });
    }

    if (title) {
      head.push({ type: 'text', value: '\n' }, h('title', [title]));
    }

    while (++index < meta.length) {
      head.push({ type: 'text', value: '\n' }, h('meta', meta[index]));
    }

    index = -1;

    while (++index < link.length) {
      head.push({ type: 'text', value: '\n' }, h('link', link[index]));
    }

    // Inject style tags before linked CSS
    index = -1;

    while (++index < styles.length) {
      head.push({ type: 'text', value: '\n' }, h('style', styles[index]));
    }

    index = -1;

    while (++index < css.length) {
      head.push(
        { type: 'text', value: '\n' },
        h('link', { rel: 'stylesheet', href: css[index] }),
      );
    }

    head.push({ type: 'text', value: '\n' });

    // Inject script tags before linked JS
    index = -1;

    while (++index < scripts.length) {
      contents.push(
        { type: 'text', value: '\n' },
        h('script', { type: 'module' }, scripts[index]),
      );
    }

    index = -1;
    while (++index < js.length) {
      const instance = js[index];
      if (typeof instance === 'object') {
        contents.push({ type: 'text', value: '\n' }, h('script', instance));
      } else {
        contents.push(
          { type: 'text', value: '\n' },
          h('script', { src: js[index] }),
        );
      }
    }

    contents.push({ type: 'text', value: '\n' });

    /** @type {DocType} */
    // @ts-expect-error: `name` is no longer needed.
    const doctype = { type: 'doctype' };

    return {
      type: 'root',
      children: [
        doctype,
        { type: 'text', value: '\n' },
        h('html', { lang: options.language || 'en' }, [
          { type: 'text', value: '\n' },
          h('head', head),
          { type: 'text', value: '\n' },
          h('body', contents),
          { type: 'text', value: '\n' },
        ]),
        { type: 'text', value: '\n' },
      ],
    };
  };
}

/**
 * @template Thing
 * @param {Thing|Array<Thing>|null|undefined} value
 * @returns {Array<Thing>}
 */
function cast(value) {
  return value === null || value === undefined
    ? []
    : typeof value === 'string' || !Array.isArray(value)
    ? [value]
    : value;
}
