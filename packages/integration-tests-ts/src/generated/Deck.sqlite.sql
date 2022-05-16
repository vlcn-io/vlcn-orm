-- SIGNED-SOURCE: <d1c4f336982daab49b91826eebfca690>
create table ` deck ` (
  ` id ` bigint,
  ` name ` varchar(255),
  ` created ` bigint,
  ` modified ` bigint,
  ` ownerId ` bigint,
  ` selectedSlideId ` bigint,
  primary key (` id `)
)