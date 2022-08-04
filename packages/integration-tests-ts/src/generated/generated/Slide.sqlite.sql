-- SIGNED-SOURCE: <384090fa1486df33d89753e7491be99b>
CREATE TABLE
  "slide" (
    "id" bigint NOT NULL
    /* n:1 */
,
    "deckId" bigint NOT NULL
    /* n:2 */
,
    "order" float NOT NULL
    /* n:3 */
,
    primary key ("id")
  )