-- SIGNED-SOURCE: <068063ed29bf3be270b67e1b63fa8e4e>
CREATE TABLE
  IF NOT EXISTS "component" (
    "id" bigint NOT NULL,
    "subtype" varchar(255) NOT NULL,
    "slideId" bigint NOT NULL,
    "content" text NOT NULL,
    primary key ("id")
  )