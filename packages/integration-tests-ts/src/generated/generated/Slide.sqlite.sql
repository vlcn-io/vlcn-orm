-- SIGNED-SOURCE: <eece7ca4c38f4d79bd2027ff5e756b0f>
CREATE TABLE
  "slide" (
    "id" bigint NOT NULL
    /* n=1 */
,
    "deckId" bigint NOT NULL
    /* n=2 */
,
    "order" float NOT NULL
    /* n=3 */
,
    PRIMARY KEY ("id")
  )