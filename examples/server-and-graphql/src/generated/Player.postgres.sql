-- SIGNED-SOURCE: <c100b2d5fd07f332dacec6b02aece6d0>
CREATE TABLE
  "public"."player" (
    "id" bigint NOT NULL,
    "piece" text NOT NULL,
    "ownerId" bigint NOT NULL,
    "gameId" bigint NOT NULL,
    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
  )