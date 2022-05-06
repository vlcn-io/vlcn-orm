-- SIGNED-SOURCE: <b2230a56b9d37de4cdf07dab27132559>
create table "deck" (
  "id" bigint,
  "name" varchar(255),
  "created" bigint,
  "modified" bigint,
  "ownerId" bigint,
  "selectedSlideId" bigint
);
alter table
  "deck"
add
  constraint "deck_pkey" primary key ("id")