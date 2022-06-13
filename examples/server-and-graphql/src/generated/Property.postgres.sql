-- SIGNED-SOURCE: <341f057358215c2dccd645ae4e080b8e>
CREATE TABLE
  "public"."property" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "ownerId" bigint,
    "gameId" bigint NOT NULL,
    "cost" text NOT NULL,
    "mortgaged" text NOT NULL,
    "numHouses" text NOT NULL,
    "numHotels" text NOT NULL,
    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
  )