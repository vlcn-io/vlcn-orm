-- SIGNED-SOURCE: <0c3f0013da7f8fabd9d49330cde532a5>
create table
  `deck` (
    `id` bigint,
    `name` varchar(255),
    `created` bigint,
    `modified` bigint,
    `ownerId` bigint,
    `selectedSlideId` bigint,
    primary key (`id`)
  )