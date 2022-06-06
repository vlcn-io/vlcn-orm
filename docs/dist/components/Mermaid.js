import React from 'https://esm.sh/react';
export default function Mermaid({ id, chart }) {
    return (React.createElement("div", { ref: (node) => {
            mermaid.mermaidAPI.render(id, chart, (svgCode) => {
                node.innerHTML = svgCode;
            });
        } }));
}
