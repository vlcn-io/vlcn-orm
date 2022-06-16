-- SIGNED-SOURCE: <64c81ec4396e235c7ba70b27446c42bc>
CREATE TABLE
  IF NOT EXISTS "deck" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "created" bigint NOT NULL,
    "modified" bigint NOT NULL,
    "ownerId" bigint NOT NULL,
    "selectedSlideId" bigint NOT NULL,
    primary key ("id")
  )