-- SIGNED-SOURCE: <209ea38dd3ad6b28ed15d0cdf14ad6fa>
create table "slide" ("id" bigint, "deckId" bigint, "order" real);
alter table
  "slide"
add
  constraint "slide_pkey" primary key ("id")