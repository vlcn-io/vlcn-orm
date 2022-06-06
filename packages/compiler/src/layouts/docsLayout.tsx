// @ts-nocheck -- jsx hastscript types don't work with hast??
import { select } from "hast-util-select";
import { h } from "hastscript";
import { VFile } from "vfile";

export default function docsLayout(tree: ReturnType<typeof h>, file: VFile) {
  const body = select("body", tree);
  if (!body) {
    throw new Error(
      "Body is required to exist before applying the default layout"
    );
  }
  const newChildren = [body.children];
  const matter = file.data.matter;
  body.children = [
    <aside>
      <div class="center">
        <div class="god-circle center-block">
          <div class="god-head god-head-aphrodite"></div>
        </div>
      </div>
      <ol>
        <li>
          <a href="#">Introduction</a>
        </li>
        <li>
          <a href="#">Quickstart</a>
        </li>
        <li>
          <a href="#">Schema</a>
        </li>
        <li>
          <a href="#">Models</a>
        </li>
        <li class=" indent">
          <a href="#">Mutations & Transactions</a>
        </li>
        <li>
          <a href="#">Queries</a>
        </li>
        <li>
          <a href="#">Reactivity</a>
        </li>
        <li>
          <a href="#">Data Sync & P2P</a>
        </li>
        <li>
          <a href="#">Permissions</a>
        </li>
        <li>
          <a href="#">Migrations</a>
        </li>
      </ol>
    </aside>,
    <main>
      <article>
        {matter?.title ? <h1>{matter.title}</h1> : []}
        <section>{newChildren}</section>
      </article>
    </main>,
  ];
}

docsLayout.doc = {
  css: ["/docs/index.css"],
};
