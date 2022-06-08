// @ts-nocheck -- jsx hastscript types don't work with hast??
import { select } from "hast-util-select";
import { h } from "hastscript";
import { VFile } from "vfile";

export default function blogLayout(tree: ReturnType<typeof h>, file: VFile) {
  const body = select("body", tree);
  if (!body) {
    throw new Error(
      "Body is required to exist before applying the default layout"
    );
  }
  const newChildren = [body.children];
  const matter = file.data.matter;
  const docName = file.basename?.substring(
    0,
    file.basename.length - (file.extname?.length || 0)
  );

  body.children = [
    <aside>
      <div class="center">
        <a class="home-link" href="/">
          <div class="god-circle center-block">
            <div class={`god-head god-head-aphrodite`}></div>
          </div>
        </a>
      </div>
    </aside>,
    <main>
      <article>
        {matter?.title ? <h1>{matter.title}</h1> : []}
        {matter?.subtitle ? <p class="subtitle">{matter.subtitle}</p> : []}
        <section>{newChildren}</section>
      </article>
    </main>,
  ];
}

blogLayout.doc = {
  css: ["/docs/index.css"],
  js: ["/assets/god-switcher.js"],
};
