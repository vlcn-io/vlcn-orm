-- SIGNED-SOURCE: <6a9f5ec3f74b7ffcb57f08b381c4fc29>
CREATE TABLE
  "user" (
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
    primary key ("id")
  )