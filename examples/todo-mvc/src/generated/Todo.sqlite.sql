-- SIGNED-SOURCE: <a8aa2c917bb640c09c275c16a5408c86>
CREATE TABLE
  `todo` (
    `id` bigint,
    `text` text,
    `created` bigint,
    `modified` bigint,
    `completed` bigint,
    primary key (`id`)
  );