import { h } from "hastscript";
import { VFile } from "vfile";
import blogLayout from "./blogLayout.js";
import docsLayout from "./docsLayout.js";

export const layouts = {
  default: blogLayout,
  docs: docsLayout,
} as const;

type Layout = keyof typeof layouts;

export default function layout() {
  return (tree: ReturnType<typeof h>, file: VFile) => {
    layouts[((file.data as any)?.matter?.layout as Layout) || "default"](
      tree,
      file
    );
  };
}

export function getLayout(l: Layout) {
  return layouts[l] || layouts["default"];
}
