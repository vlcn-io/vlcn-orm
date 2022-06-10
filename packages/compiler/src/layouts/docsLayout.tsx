// @ts-nocheck -- jsx hastscript types don't work with hast??
import { select } from "hast-util-select";
import { h } from "hastscript";
import { VFile } from "vfile";

// TODO: just roll this into the files themselves.
// And do a pass that gethers the file names and matter to allow nav generation.
const sections = [
  {
    name: "why",
    title: "Why Aphrodite",
    god: "aphrodite",
  },
  {
    name: "quickstart",
    title: "Quickstart",
    god: "hermes",
  },
  {
    name: "schemas",
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
    title: "Mutating Data",
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
    <a
      href="https://github.com/tantaman/aphrodite"
      class="github-corner"
      aria-label="View source on GitHub"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 250 250"
        style="fill:var(--dress); color:var(--black); position: absolute; top: 0; border: 0; right: 0;"
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px;"
          class="octo-arm"
        ></path>
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        ></path>
      </svg>
    </a>,
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
        {matter?.subtitle ? <p class="subtitle">{matter.subtitle}</p> : []}
        <section>{newChildren}</section>
      </article>
    </main>,
  ];
}

docsLayout.doc = {
  css: ["/docs/index.css"],
  js: ["/assets/god-switcher.js"],
};
