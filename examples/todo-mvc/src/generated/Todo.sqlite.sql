-- SIGNED-SOURCE: <e17f7dacd3e46f1c6ee0cbb758565ded>
CREATE TABLE
  `todo` (
    `id` bigint,
    `text` text,
    `created` bigint,
    `modified` bigint,
    `ownerId` bigint,
    primary key (`id`)
  );