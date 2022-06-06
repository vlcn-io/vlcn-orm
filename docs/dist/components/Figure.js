// @ts-ignore
import React from 'https://esm.sh/react';
export default function Figure({ description, source, source_url, url, }) {
    return (React.createElement("figure", { className: "image", style: { textAlign: 'center' } },
        React.createElement("img", { src: url, alt: description }),
        React.createElement("figcaption", null,
            React.createElement("i", null,
                description,
                source ? React.createElement("a", { href: source_url }, source) : null))));
}
