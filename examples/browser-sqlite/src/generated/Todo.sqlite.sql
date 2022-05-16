-- SIGNED-SOURCE: <4fa7e47dae03ba6b9e5343790477c468>
create table ` todo ` (
  ` id ` bigint,
  ` text ` varchar(255),
  ` created ` bigint,
  ` modified ` bigint,
  ` ownerId ` bigint,
  primary key (` id `)
)