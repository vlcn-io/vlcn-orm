-- SIGNED-SOURCE: <13f52e641f67b6684b9ca778217bc546>
CREATE TABLE
  "deck" (
    "id" bigint NOT NULL
    /* n:1 */
,
    "name" text NOT NULL
    /* n:2 */
,
    "created" bigint NOT NULL
    /* n:3 */
,
    "modified" bigint NOT NULL
    /* n:4 */
,
    "ownerId" bigint NOT NULL
    /* n:5 */
,
    "selectedSlideId" bigint
    /* n:6 */
,
    primary key ("id")
  )