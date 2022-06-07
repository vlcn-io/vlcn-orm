// @ts-nocheck -- jsx hastscript types don't work with hast??
import { select } from "hast-util-select";
import { h } from "hastscript";
import { VFile } from "vfile";

// TODO: just roll this into the files themselves.
// And do a pass that gethers the file names and matter to allow nav generation.
const sections = [
  {
    name: "introduction",
    title: "Introduction",
    god: "aphrodite",
  },
  {
    name: "quickstart",
    title: "Quickstart",
    god: "hermes",
  },
  {
    name: "schema",
    title: "Schemas",
    god: "aphrodite",
  },
  {
    name: "models",
    title: "Models",
    god: "ares",
  },
  {
    name: "mutations-and-transactions",
    title: "Mutations & Transactions",
    god: "dionysus",
  },
  {
    name: "queries",
    title: "Queries",
    god: "poseidon",
  },
  {
    name: "reactivity",
    title: "Reactivity",
    god: "artemis",
  },
  {
    name: "data-sync-p2p",
    title: "Data Sync & P2P",
    god: "aphrodite",
  },
  {
    name: "permissions",
    title: "Permissions",
    god: "zeus",
  },
  {
    name: "migrations",
    title: "Migrations",
    god: "hephaestus",
  },
];

export default function docsLayout(tree: ReturnType<typeof h>, file: VFile) {
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

  const thisSection = sections.find((s) => s.name === docName);
  body.children = [
    <aside>
      <div class="center">
        <a class="home-link" href="/">
          <div class="god-circle center-block">
            <div class={`god-head god-head-aphrodite`}></div>
          </div>
        </a>
        <a class="hamburger"></a>
      </div>
      <ol>
        {sections.map((s) => (
          <li class={s.name === docName ? "active indent" : "indent"}>
            <a href={`/docs/${s.name}`}>{s.title}</a>
          </li>
        ))}
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
  js: ["/assets/god-switcher.js"],
};
