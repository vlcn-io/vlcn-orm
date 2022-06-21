-- SIGNED-SOURCE: <ae25748cc6e16cfa98df0f0ae52b585f>
CREATE TABLE
  IF NOT EXISTS "track" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    "albumId" bigint,
    "mediaTypeId" bigint NOT NULL,
    "genreId" bigint,
    "composter" text,
    "milliseconds" int NOT NULL,
    "bytes" int,
    "price" float NOT NULL,
    primary key ("id")
  )