-- SIGNED-SOURCE: <9fd8caa2868fcc71aa0da1cec7b129bb>
create table if not exists ` todo ` (
  ` id ` bigint,
  ` text ` varchar(255),
  ` created ` bigint,
  ` modified ` bigint,
  ` ownerId ` bigint,
  primary key (` id `)
)