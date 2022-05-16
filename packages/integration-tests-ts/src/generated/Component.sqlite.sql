-- SIGNED-SOURCE: <5b9ad3e13ab8a0ea3f92c0b84cfdc8b2>
create table
  `component` (
    `id` bigint,
    `subtype` varchar(255),
    `slideId` bigint,
    `content` text,
    primary key (`id`)
  )