-- SIGNED-SOURCE: <43de6d8d3ab36b1dbc82f5af7e565b8d>
CREATE TABLE
  IF NOT EXISTS "property" (
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