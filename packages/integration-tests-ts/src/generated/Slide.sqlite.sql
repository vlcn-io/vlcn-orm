-- SIGNED-SOURCE: <6de05b5e8b8ea19f069c20af0ba808a3>
CREATE TABLE
  IF NOT EXISTS "slide" (
    "id" bigint NOT NULL,
    "deckId" bigint NOT NULL,
    "order" float NOT NULL,
    primary key ("id")
  )