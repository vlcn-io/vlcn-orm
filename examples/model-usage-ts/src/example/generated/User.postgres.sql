-- SIGNED-SOURCE: <84753de1714b86769444320eb8ea95ca>
create table
  "user" (
    "id" bigint,
    "name" varchar(255),
    "created" bigint,
    "modified" bigint
  );

alter table
  "user"
add
  constraint "user_pkey" primary key ("id")