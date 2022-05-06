-- SIGNED-SOURCE: <13fdf6d75dee327e18b81043637c3597>
create table "user" (
  "id" bigint,
  "name" varchar(255),
  "created" bigint,
  "modified" bigint
);
alter table
  "user"
add
  constraint "user_pkey" primary key ("id")