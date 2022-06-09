-- SIGNED-SOURCE: <539c39f335e29c2f73550ecba61a5fbc>
CREATE TABLE
  "deck" (
    "id" bigint,
    "name" text,
    "created" bigint,
    "modified" bigint,
    "ownerId" bigint,
    "selectedSlideId" bigint,
    primary key ("id")
  )