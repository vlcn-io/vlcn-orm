-- SIGNED-SOURCE: <e0419ab0407d038e59d8c39b0adf105e>
create table "component" (
  "id" bigint,
  "subtype" varchar(255),
  "slideId" bigint,
  "content" text
);
alter table
  "component"
add
  constraint "component_pkey" primary key ("id")