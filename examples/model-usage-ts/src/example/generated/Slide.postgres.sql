-- SIGNED-SOURCE: <b9ba1ae5a2f07b5ece902ed49954b2ed>
create table
  "slide" ("id" bigint, "deckId" bigint, "order" real);

alter table
  "slide"
add
  constraint "slide_pkey" primary key ("id")