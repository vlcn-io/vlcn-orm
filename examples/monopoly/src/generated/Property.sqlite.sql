-- SIGNED-SOURCE: <0d32705fae927aee37e4eef4c1282106>
CREATE TABLE
  "property" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "ownerId" bigint,
    "gameId" bigint NOT NULL,
    "cost" text NOT NULL,
    "mortgaged" text NOT NULL,
    "numHouses" text NOT NULL,
    "numHotels" text NOT NULL,
    primary key ("id")
  )