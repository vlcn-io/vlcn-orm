-- SIGNED-SOURCE: <ac53487da4b6bd4b8a759e33b99bc493>
CREATE TABLE
  IF NOT EXISTS "deck" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "created" bigint NOT NULL,
    "modified" bigint NOT NULL,
    "ownerId" bigint NOT NULL,
    "selectedSlideId" bigint,
    primary key ("id")
  )