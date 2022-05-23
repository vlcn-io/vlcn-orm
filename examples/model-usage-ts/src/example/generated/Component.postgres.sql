-- SIGNED-SOURCE: <5ebb41dee80d595ed9eb7f66cdefd045>
create table
  "component" (
    "id" bigint,
    "subtype" varchar(255),
    "slideId" bigint,
    "content" text
  );

alter table
  "component"
add
  constraint "component_pkey" primary key ("id")