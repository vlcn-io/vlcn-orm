-- SIGNED-SOURCE: <fdfa0aaff1d88e3f25e9404efc1b2f71>
CREATE TABLE
  "deck" (
    "id" bigint NOT NULL
    /* n=1 */
,
    "name" text NOT NULL
    /* n=2 */
,
    "created" bigint NOT NULL
    /* n=3 */
,
    "modified" bigint NOT NULL
    /* n=4 */
,
    "ownerId" bigint NOT NULL
    /* n=5 */
,
    "selectedSlideId" bigint
    /* n=6 */
,
    PRIMARY KEY ("id")
  )