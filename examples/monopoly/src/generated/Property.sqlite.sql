-- SIGNED-SOURCE: <08d2c4888e57b6cdcaa6a8f0ef8ad9c7>
CREATE TABLE
  IF NOT EXISTS "property" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "ownerId" bigint,
    "gameId" bigint NOT NULL,
    "cost" float NOT NULL,
    "mortgaged" boolean NOT NULL,
    "numHouses" int NOT NULL,
    "numHotels" int NOT NULL,
    primary key ("id")
  )