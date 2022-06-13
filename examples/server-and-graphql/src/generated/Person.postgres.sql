-- SIGNED-SOURCE: <e0ae9dd4577ad7188a454ed7ecdea967>
CREATE TABLE
  "public"."person" (
    "id" bigint NOT NULL,
    "token" text NOT NULL,
    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
  )