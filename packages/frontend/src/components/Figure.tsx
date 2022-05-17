// @ts-ignore
import React from 'https://esm.sh/react';

export default function Figure({
  description,
  source,
  source_url,
  url,
}: {
  description: string;
  source: string;
  source_url: string;
  url: string;
}) {
  return (
    <figure className="image" style={{ textAlign: 'center' }}>
      <img src={url} alt={description} />
      <figcaption>
        <i>
          {description}
          {source ? <a href={source_url}>{source}</a> : null}
        </i>
      </figcaption>
    </figure>
  );
}
