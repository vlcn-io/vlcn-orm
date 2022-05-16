-- SIGNED-SOURCE: <4f301f575722ffcd89bedeb073ef1417>
create table if not exists ` user ` (
  ` id ` bigint,
  ` name ` varchar(255),
  ` created ` bigint,
  ` modified ` bigint,
  primary key (` id `)
)