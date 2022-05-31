-- SIGNED-SOURCE: <348c30a32154bec6b019a011718cafae>
CREATE TABLE
  `deck` (
    `id` bigint,
    `name` text,
    `created` bigint,
    `modified` bigint,
    `ownerId` bigint,
    `selectedSlideId` bigint,
    primary key (`id`)
  );