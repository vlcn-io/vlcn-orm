-- SIGNED-SOURCE: <a629a9825cbc1725387b278167a2843c>
CREATE TABLE
  `todo` (
    `id` bigint,
    `listId` bigint,
    `text` text,
    `created` bigint,
    `modified` bigint,
    `completed` bigint,
    primary key (`id`)
  );