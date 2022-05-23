-- SIGNED-SOURCE: <5592cbf363de9eb17740f910d314bbc5>
create table
  "deck" (
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