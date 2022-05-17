import React from 'https://esm.sh/react';

export default function Mermaid({ id, chart }) {
  return (
    <div
      ref={(node) => {
        mermaid.mermaidAPI.render(id, chart, (svgCode) => {
          node.innerHTML = svgCode;
        });
      }}
    ></div>
  );
}
