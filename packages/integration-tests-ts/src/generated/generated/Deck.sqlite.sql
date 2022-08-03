-- SIGNED-SOURCE: <8247184e292615f00ab2b9a2b9d9154a>
CREATE TABLE
  "deck" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "created" bigint NOT NULL,
    "modified" bigint NOT NULL,
    "ownerId" bigint NOT NULL,
    "selectedSlideId" bigint,
    primary key ("id")
  )